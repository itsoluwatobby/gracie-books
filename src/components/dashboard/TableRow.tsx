import { useState } from "react";
import Button from "../ui/Button";

interface TableRowProps {
  book: Book;
  handleEditBook: (book: Book) => void;
  formatCurrency: (val: number) => string;
}

export const TableRow: React.FC<TableRowProps> = (
  {
    book,
    handleEditBook,
    formatCurrency,
  }
) => {
  const [isImageDisplayed, setIsImageDisplayed] = useState(true);

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-8 flex-shrink-0 mr-3 border">
            {
              (book?.coverImage || book?.icon) ?
              <img 
                className="h-10 w-8 object-cover rounded-sm" 
                src={isImageDisplayed ? book.coverImage : book?.icon} 
                onError={() => setIsImageDisplayed(false)}
                alt={book.title} 
              />
              : <p className="text-center">
                {book.title.substring(0,2)}
              </p>
            }
          </div>
          <div className="text-sm font-medium text-gray-900 line-clamp-1 max-w-[10rem]">
            {book.title}
          </div>
        </div>
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
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
        <Button variant="ghost" size="sm"
        onClick={() => handleEditBook(book)}
        >Edit</Button>
      </td>
    </tr>
  );
}