import Button from '../ui/Button';

type ManageBooksProps = {
  books: Book[]
  handleEditBook: (book: Book) => void;
  formatCurrency: (val: number) => string;
  setShowBookModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ManageBooks(
  {
    books, handleEditBook, formatCurrency,
    setShowBookModal,
  }: ManageBooksProps
  ) {
  const TableHead = ['Book', 'Author', 'Price', 'Quantity', 'Actions'];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Books</h2>
        <Button
        onClick={() => setShowBookModal(true)}
        >Add New Book</Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {
                  TableHead.map((head) => (
                    <th scope="col" 
                    key={head}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {head}
                    </th>
                  ))
                }
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {books.map(book => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-8 flex-shrink-0 mr-3">
                        <img 
                          className="h-10 w-8 object-cover" 
                          src={book.coverImage} 
                          alt={book.title} 
                        />
                      </div>
                      <div className="text-sm font-medium text-gray-900 line-clamp-1 max-w-xs">
                        {book.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {book.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(book.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}