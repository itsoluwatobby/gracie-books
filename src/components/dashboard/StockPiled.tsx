import { ModalSelections } from "../../utils/constants";
import Button from "../ui/Button";
import Card from "../ui/Card"

type StockPiledProps = {
  books: Book[];
  setActiveSection: React.Dispatch<React.SetStateAction<ModalSelectionsType>>;
}

export default function StockPiled(
  {
    books, setActiveSection,
  }: StockPiledProps
) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Stock Piled Books</h3>
      <div className="space-y-4">
        {books
          .filter(book => book.stockQuantity < 5)
          .slice(0, 3)
          .map(book => (
            <div key={book.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-14 bg-gray-200 rounded overflow-hidden mr-3">
                  <img 
                    src={book.coverImage} 
                    alt={book.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium line-clamp-1">{book.title}</div>
                  <div className="text-sm text-gray-500">{book.author}</div>
                </div>
              </div>
              <div className={`text-sm font-medium ${
                book.stockQuantity === 0 ? 'text-red-600' : 'text-orange-600'
              }`}>
                {book.stockQuantity} in stock
              </div>
            </div>
          ))}
      </div>
      <div className="mt-4 text-center">
        <Button 
          variant="outline"
          size="sm"
          onClick={() => setActiveSection(ModalSelections.books)}
        >
          View Stocks
        </Button>
      </div>
    </Card>
  )
}