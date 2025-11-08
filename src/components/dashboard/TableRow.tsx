/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Button from "../ui/Button";
import { bookServices } from "../../services";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { PageRoutes } from "../../utils/pageRoutes";

interface TableRowProps {
  book: Book;
  handleEditBook: (book: Book) => void;
  handleDelete: (bookId: string) => void;
  formatCurrency: (val: number) => string;
}

export const TableRow: React.FC<TableRowProps> = (
  {
    book,
    handleEditBook,
    handleDelete,
    formatCurrency,
  }
) => {
  const [isImageDisplayed, setIsImageDisplayed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleVisibility = async (bookId: string, status: Book["status"]) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const bookStatus = status === 'private' ? 'public' : 'private';
      await bookServices.updateBookStatus(bookId, bookStatus);
      book.status = bookStatus;
    } catch {
      toast.error('Error updating book status');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <tr className={`hover:bg-gray-50 cursor-default text-center ${isLoading ? 'animate-pulse bg-gray-50' : ''}`}>
      <td className="px-6 py-4 whitespace-nowrap">
        <Link to={`${PageRoutes.books}/${book.id}`} className="flex items-center">
          <div className="h-10 w-8 flex-shrink-0 mr-3 border">
            {
              (book?.coverImage || book?.icon) ?
              <img 
                className="h-10 w-8 object-cover rounded-sm" 
                src={isImageDisplayed ? book.coverImage : book?.icon} 
                onError={() => setIsImageDisplayed(false)}
                alt={book.title}
              />
              : <span className="text-center">
                {book.title.substring(0,2)}
              </span>
            }
          </div>
          <div className="text-sm font-medium text-gray-900 line-clamp-1 w-fit max-w-[10rem]">
            {book.title}
          </div>
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {book.authors.join(',')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 textcenter">
        {formatCurrency(book.price)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap max-sm:text-center">
        <span className={`${
          book.stockQuantity === 0 ? 'text-red-600' : 
          book.stockQuantity < 5 ? 'text-yellow-600' :
          'text-green-600'
        }`}>
          {book.stockQuantity}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap max-sm:text-center">
        <button 
        disabled={isLoading}
        onClick={() => handleVisibility(book.id, book.status)}
        className={`border px-3 py-1 rounded-xl text-sm ${
          book.status === 'public' ? 'bg-green-100 border-green-200' : 
          'bg-red-100 border-red-200'
        }`}>
          {book.status}
        </button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm flex justify-center gap-3">
        <Button variant="outline" size="sm"
        onClick={() => handleEditBook(book)}
        >Edit</Button>
        <Button variant="danger" size="sm"
        onClick={() => handleDelete(book.id)}
        >Delete</Button>
      </td>
    </tr>
  );
}