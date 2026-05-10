/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Book,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  Hash,
  Image,
  ImageIcon,
  Package,
  Star,
  User,
  AlertCircle,
} from "lucide-react";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { InitBookForm } from "../../../utils/initVariables";
import { bookServices } from "../../../services";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { deleteFromFirebaseStorage, storage } from "../../../firebase/config";
import { nanoid } from "nanoid/non-secure";

type BookFormProps = {
  editBook: Book | null;
  bookForm: Partial<Book>;
  setBookForm: React.Dispatch<React.SetStateAction<Partial<Book>>>;
  setShowBookModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditBook: React.Dispatch<React.SetStateAction<Book | null>>;
  setReload: React.Dispatch<React.SetStateAction<Reloads>>;
}

type FormErrors = {
  title?: string;
  authors?: string;
  description?: string;
  price?: string;
  stockQuantity?: string;
  pageCount?: string;
  genre?: string;
}

export const BookForm: React.FC<BookFormProps> = ({
  bookForm, setBookForm,
  editBook, setShowBookModal,
  setEditBook,
  setReload,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [coverImageError, setCoverImageError] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setUploadProgress(0);
    setUploadError(null);
    setCoverImageError(false);
  };

  const uploadToFirebase = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const filename = `${nanoid(24)}_${file.name}`;
      const storageRef = ref(storage, `books_thumbnails/${filename}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(progress);
        },
        (error) => {
          setUploadProgress(0);
          reject(new Error(`Upload failed: ${error.message}`));
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};

    if (!bookForm.title?.trim()) {
      errs.title = 'Title is required';
    }
    if (!bookForm.authors?.length || !bookForm.authors[0]?.trim()) {
      errs.authors = 'At least one author is required';
    }
    if (!bookForm.description?.trim()) {
      errs.description = 'Description is required';
    }
    if (bookForm.price === undefined || bookForm.price <= 0) {
      errs.price = 'Price must be greater than 0';
    }
    if (bookForm.stockQuantity === undefined || isNaN(bookForm.stockQuantity) || bookForm.stockQuantity < 0) {
      errs.stockQuantity = 'Stock quantity must be 0 or more';
    }
    if (!bookForm.pageCount || bookForm.pageCount <= 0) {
      errs.pageCount = 'Page count must be greater than 0';
    }
    if (!bookForm.genre?.length || !bookForm.genre[0]?.trim()) {
      errs.genre = 'At least one genre is required';
    }

    return errs;
  };

  const handleBookFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    try {
      setIsLoading(true);

      let updatedForm: Partial<Book> = { ...bookForm };

      if (file) {
        // Delete the old cover image if editing and there's an existing one
        if (editBook?.coverImage) {
          await deleteFromFirebaseStorage(editBook.coverImage);
        }
        const imageURL = await uploadToFirebase(file);
        updatedForm = {
          ...updatedForm,
          coverImage: imageURL,
          previewImages: [imageURL, ...(updatedForm.previewImages ?? [])],
        };
      }

      if (!editBook) {
        await bookServices.addBook(updatedForm);
        toast.success(`"${updatedForm.title}" uploaded`);
      } else {
        const { id, ...rest } = updatedForm;
        await bookServices.updateBook(id!, rest);
        toast.success(`"${updatedForm.title}" updated`);
      }

      setEditBook(null);
      setBookForm(InitBookForm);
      setFile(null);
      setUploadProgress(0);

      setReload((prev) => ({
        ...prev,
        bookUpdate_reload: prev.bookUpdate_reload + 1,
      }));

      setShowBookModal(false);
    } catch (err: any) {
      toast.error(err.message);
      setUploadError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setEditBook(null);
    setShowBookModal(false);
  };

  const previewSrc = file
    ? URL.createObjectURL(file)
    : coverImageError
      ? bookForm?.icon
      : bookForm?.coverImage;

  const hasPreview = !!(file || bookForm?.coverImage || bookForm?.icon);

  return (
    <form onSubmit={handleBookFormSubmit} className="space-y-6">

      {/* Upload / submit-level error banner */}
      {uploadError && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
            <Book className="w-5 h-5 text-blue-600" />
            Basic Information
          </h3>

          {/* Thumbnail picker */}
          <label htmlFor="book_thumbnail" className="flex items-end my-3 gap-3 cursor-pointer w-fit">
            <figure className="size-40 rounded-md bg-gray-100 border flex overflow-hidden flex-shrink-0">
              {hasPreview ? (
                <img
                  src={previewSrc}
                  onError={() => setCoverImageError(true)}
                  className="w-full h-full object-cover rounded-md"
                  alt="Book thumbnail"
                />
              ) : (
                <ImageIcon size={34} className="self-center text-gray-300 mx-auto" />
              )}
            </figure>
            <input
              type="file"
              id="book_thumbnail"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-sm font-medium text-gray-700">
                {file ? 'Change Thumbnail' : 'Book Thumbnail'}
              </span>
              <span className="text-xs text-gray-400">Click to {file || bookForm?.coverImage ? 'change' : 'upload'}</span>
              {isLoading && file && uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-40 mt-1">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Uploading…</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
              {isLoading && file && uploadProgress === 100 && (
                <span className="text-xs text-green-600 mt-1">Upload complete</span>
              )}
            </div>
          </label>

          <div className="flex items-center justify-between gap-10 max-xxs:flex-col">
            <Input
              label="Title"
              value={bookForm.title}
              onChange={(e) => {
                setBookForm({ ...bookForm, title: e.target.value });
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              error={errors.title}
              required
              fullWidth
              icon={<Book className="w-4 h-4" />}
            />
            <Input
              label="Author"
              value={bookForm.authors?.join(', ')}
              onChange={(e) => {
                setBookForm({ ...bookForm, authors: e.target.value.split(',').map(g => g.trim()) });
                if (errors.authors) setErrors((prev) => ({ ...prev, authors: undefined }));
              }}
              error={errors.authors}
              required
              fullWidth
              icon={<User className="w-4 h-4" />}
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium mb-2 flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-gray-500" />
              Description
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <textarea
              value={bookForm.description}
              onChange={(e) => {
                setBookForm({ ...bookForm, description: e.target.value });
                if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
              }}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm ${
                errors.description ? 'border-red-400' : 'border-gray-200'
              }`}
              rows={4}
              placeholder="Enter book description..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.description}
              </p>
            )}
          </div>
        </div>

        {/* Publication Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
            <Building2 className="w-5 h-5 text-purple-600" />
            Publication Details
          </h3>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="hardBack"
              checked={bookForm.hardBack}
              onChange={(e) => setBookForm({ ...bookForm, hardBack: e.target.checked })}
              className="border cursor-pointer border-gray-400 size-5 rounded-md"
            />
            <label htmlFor="hardBack" className="block text-sm font-medium">
              Hard Back
            </label>
          </div>

          <div className="flex items-center justify-between gap-10 max-xxs:flex-col">
            <Input
              label="ISBN"
              value={bookForm.isbn}
              onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
              fullWidth
              icon={<Hash className="w-4 h-4" />}
            />
            <Input
              label="Publisher"
              value={bookForm.publisher}
              onChange={(e) => setBookForm({ ...bookForm, publisher: e.target.value })}
              fullWidth
              icon={<Building2 className="w-4 h-4" />}
            />
          </div>

          <div className="flex items-center justify-between gap-10 max-xxs:flex-col">
            <Input
              label="Publication Date"
              type="date"
              value={bookForm.publicationDate}
              onChange={(e) => setBookForm({ ...bookForm, publicationDate: e.target.value })}
              fullWidth
              icon={<Calendar className="w-4 h-4" />}
            />
            <Input
              label="Page Count"
              type="number"
              min={1}
              value={bookForm.pageCount || ''}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setBookForm({ ...bookForm, pageCount: isNaN(val) ? 0 : val });
                if (errors.pageCount) setErrors((prev) => ({ ...prev, pageCount: undefined }));
              }}
              error={errors.pageCount}
              required
              fullWidth
              icon={<FileText className="w-4 h-4" />}
            />
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-0">
        <div className="flex items-center justify-between gap-10 max-xxs:flex-col">
          <Input
            label="Price (₦)"
            type="number"
            // step="50"
            min={1}
            value={bookForm.price || ''}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setBookForm({ ...bookForm, price: isNaN(val) ? 0 : val });
              if (errors.price) setErrors((prev) => ({ ...prev, price: undefined }));
            }}
            error={errors.price}
            required
            fullWidth
            icon={<DollarSign className="w-4 h-4" />}
          />
          <Input
            label="Stock Quantity"
            type="number"
            min={0}
            value={bookForm.stockQuantity ?? ''}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setBookForm({ ...bookForm, stockQuantity: isNaN(val) ? 0 : val });
              if (errors.stockQuantity) setErrors((prev) => ({ ...prev, stockQuantity: undefined }));
            }}
            error={errors.stockQuantity}
            required
            fullWidth
            icon={<Package className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center justify-between gap-10 max-xxs:flex-col">
          <Input
            label="Rating (0–5)"
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={bookForm.rating || ''}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setBookForm({ ...bookForm, rating: isNaN(val) ? 0 : Math.min(5, Math.max(0, val)) });
            }}
            fullWidth
            icon={<Star className="w-4 h-4" />}
          />
          <Input
            label="Cover Image URL"
            value={bookForm.coverImage}
            onChange={(e) => {
              setBookForm({ ...bookForm, coverImage: e.target.value });
              setCoverImageError(false);
            }}
            fullWidth
            icon={<Image className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Genres */}
      <div>
        <label className="block text-gray-700 font-medium mb-2 text-sm">
          Genres (comma-separated)
          <span className="text-red-500 ml-0.5">*</span>
        </label>
        <input
          type="text"
          value={bookForm.genre?.join(', ')}
          onChange={(e) => {
            setBookForm({ ...bookForm, genre: e.target.value.split(',').map(g => g.trim()) });
            if (errors.genre) setErrors((prev) => ({ ...prev, genre: undefined }));
          }}
          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
            errors.genre ? 'border-red-400' : 'border-gray-200'
          }`}
          placeholder="Fiction, Adventure, Mystery..."
        />
        {errors.genre && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.genre}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button
          variant="outline"
          onClick={closeModal}
          type="button"
          className="px-6 py-3"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          isLoading={isLoading}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {editBook ? 'Save Changes' : 'Add Book'}
        </Button>
      </div>
    </form>
  );
}
