/* eslint-disable @typescript-eslint/no-explicit-any */
import { Book, Building2, Calendar, DollarSign, FileText, Hash, Image, ImageIcon, Package, Star, User } from "lucide-react";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { InitBookForm } from "../../../utils/initVariables";
import { bookServices } from "../../../services";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { getSignedUploadURL, uploadWithSignedURL } from "../../../supabase/config";

type BookFormProps = {
  editBook: Book | null;
  bookForm: Partial<Book>;
  setBookForm: React.Dispatch<React.SetStateAction<Partial<Book>>>
  setShowBookModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditBook: React.Dispatch<React.SetStateAction<Book | null>>;
  setReload: React.Dispatch<React.SetStateAction<Reloads>>
}

export const BookForm: React.FC<BookFormProps> = (
  {
    bookForm, setBookForm,
    editBook, setShowBookModal,
    setEditBook,
    setReload,
  },
) => {
  const [isloading, setIsloading] = useState(false);
  const [file, setFile] = useState<File>({} as File);

  const handleBookFormSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isloading) return;
    try {
      setIsloading(true);

      if (file.name) {
        const uploadResponse = await getSignedUploadURL(file);
        const imageData = await uploadWithSignedURL(file, uploadResponse);

        const imageURL = `${import.meta.env.VITE_SPABASE_URL}/storage/v1/object/public/${imageData.fullPath}`
        bookForm.coverImage = imageURL;
        bookForm.previewImages?.unshift(imageURL);
      }
    
      if (!editBook) {
        await bookServices.addBook(bookForm);
        toast.success(`${bookForm.title} uploaded`);
      } else {
        const { id, ...rest } = bookForm;
        await bookServices.updateBook(id!, rest);
        toast.success(`${bookForm.title} info updated`);
      }
      setEditBook(null);
      setBookForm(InitBookForm);
      setFile({} as File);

      setReload((prev) => (
        {
          ...prev,
          bookUpdate_reload: prev.bookUpdate_reload + 1
        }
      ));

      setShowBookModal(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsloading(false);
    }
  }

  const closeModal = () => {
    setEditBook(null);
    setShowBookModal(false);
  }

  return (
    <form onSubmit={handleBookFormSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
            <Book className="w-5 h-5 text-blue-600" />
            Basic Information
          </h3>

          <label htmlFor="book_thumbnail" className="flex items-end my-3 gap-2"
          >
            <figure className="size-40 rounded-md bg-gray-100 border flex">
              {
                (file || bookForm?.coverImage)
                 ? <img 
                    src={file.size ? URL.createObjectURL(file) : bookForm?.coverImage}
                    // alt={bookForm.title}
                    className="w-full h-full object-cover rounded-md" 
                  />
                : <ImageIcon size={34} className="self-center text-gray-300 mx-auto" />
              }
            </figure>
            <input 
              type="file" 
              id="book_thumbnail"
              hidden
              accept="image/*"
              onChange={(e) => setFile((e.target.files as FileList)[0])}
            />
            <span>Book Thumbail</span>
          </label>
          
          <div className="flex items-center justify-between gap-10 max-xxs:flex-col">
            <Input
              label="Title"
              value={bookForm.title}
              onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
              required
              fullWidth
              icon={<Book className="w-4 h-4" />}
            />
            
            <Input
              label="Author"
              value={bookForm.authors?.join(',')}
              // onChange={(e) => setBookForm({ ...bookForm, authors: [...bookForm.authors!, e.target.value] })}
              onChange={(e) => setBookForm({ ...bookForm, authors: e.target.value.split(',').map(g => g.trim()) })}
              required
              fullWidth
              icon={<User className="w-4 h-4" />}
            />
          </div>
          
          <div>
            <label className="text-gray-700 font-medium mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              Description
            </label>
            <textarea
              value={bookForm.description}
              onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="Enter book description..."
              required
            />
          </div>
        </div>

        {/* Publication Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
            <Building2 className="w-5 h-5 text-purple-600" />
            Publication Details
          </h3>
          
          <div className="flex items-center justify-between gap-10 max-xxs:flex-col">
            <Input
              label="ISBN"
              value={bookForm.isbn}
              onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
              // required
              fullWidth
              icon={<Hash className="w-4 h-4" />}
            />
            
            <Input
              label="Publisher"
              value={bookForm.publisher}
              onChange={(e) => setBookForm({ ...bookForm, publisher: e.target.value })}
              // required
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
              // required
              fullWidth
              icon={<Calendar className="w-4 h-4" />}
            />

            <Input
              label="Page Count"
              type="number"
              value={bookForm.pageCount}
              onChange={(e) => setBookForm({ ...bookForm, pageCount: parseInt(e.target.value) })}
              required
              fullWidth
              icon={<FileText className="w-4 h-4" />}
            />
          </div>

        </div>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-1 gap-3">
        <div className="flex items-center justify-between gap-10 max-xxs:flex-col">
          <Input
            label="Price (₦)"
            type="number"
            step="50"
            min={0}
            value={bookForm.price}
            onChange={(e) => setBookForm({ ...bookForm, price: parseFloat(e.target.value) })}
            required
            fullWidth
            icon={<DollarSign className="w-4 h-4" />}
          />
          <Input
            label="Stock Quantity"
            type="number"
            min={0}
            value={bookForm.stockQuantity}
            onChange={(e) => setBookForm({ ...bookForm, stockQuantity: parseInt(e.target.value) })}
            required
            fullWidth
            icon={<Package className="w-4 h-4" />}
          />
        </div>
        
        <div className="flex items-center justify-between gap-10 max-xxs:flex-col">
          <Input
            label="Rating (0-5)"
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={bookForm.rating}
            onChange={(e) => setBookForm({ ...bookForm, rating: parseFloat(e.target.value) })}
            // required
            fullWidth
            icon={<Star className="w-4 h-4" />}
          />
          
          <Input
            label="Cover Image URL"
            value={bookForm.coverImage}
            onChange={(e) => setBookForm({ ...bookForm, coverImage: e.target.value })}
            // required
            fullWidth
            icon={<Image className="w-4 h-4" />}
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Genres (comma-separated)
        </label>
        <input
          type="text"
          value={bookForm.genre?.join(', ')}
          onChange={(e) => setBookForm({ ...bookForm, genre: e.target.value.split(',').map(g => g.trim()) })}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Fiction, Adventure, Mystery..."
          required
        />
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
          disabled={!bookForm.id! || isloading}
          isLoading={isloading}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {editBook ? 'Save Changes' : 'Add Book'}
        </Button>
      </div>
    </form>
  );
}