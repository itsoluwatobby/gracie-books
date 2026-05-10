import { ModalSelections } from "../../utils/constants";
import Button from "../ui/Button";
import Card from "../ui/Card"
import { PackageX } from "lucide-react";

type StockPiledProps = {
  books: Book[];
  setActiveSection: React.Dispatch<React.SetStateAction<ModalSelectionsType>>;
}

export default function StockPiled(
  {
    books, setActiveSection,
  }: StockPiledProps
) {
  const lowStockBooks = books.filter(book => book.stockQuantity < 5).slice(0, 5);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Low Stock Books</h3>
        {lowStockBooks.length > 0 && (
          <span className="text-xs bg-orange-100 text-orange-700 font-medium px-2 py-0.5 rounded-full">
            {lowStockBooks.length} item{lowStockBooks.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {lowStockBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <PackageX className="w-10 h-10 mb-2" />
          <p className="text-sm">All books are well stocked</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lowStockBooks.map(book => (
            <div key={book.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center min-w-0">
                <div className="w-10 h-14 flex-shrink-0 bg-gray-200 rounded overflow-hidden mr-3">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="font-medium line-clamp-1 text-sm">{book.title}</div>
                  <div className="text-xs text-gray-500 truncate">{book.authors[0]}</div>
                </div>
              </div>
              <span className={`flex-shrink-0 ml-3 text-xs font-semibold px-2 py-1 rounded-full ${
                book.stockQuantity === 0
                  ? 'bg-red-100 text-red-700'
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {book.stockQuantity === 0 ? 'Out of stock' : `${book.stockQuantity} left`}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveSection(ModalSelections.books)}
        >
          View All Books
        </Button>
      </div>
    </Card>
  )
}