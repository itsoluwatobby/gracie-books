/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import Button from '../ui/Button';
import { bookServices } from '../../schema';
import { initAppState } from '../../utils/initVariables';
import { TableRow } from './TableRow';
import { LoadingBook } from './LoadingBook';

type ManageBooksProps = {
  handleEditBook: (book: Book) => void;
  formatCurrency: (val: number) => string;
  setShowBookModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ManageBooks(
  {
    handleEditBook, formatCurrency,
    setShowBookModal,
  }: ManageBooksProps
  ) {
  const [books, setBooks] = useState<Book[]>([]);
  const [appState, setAppState] = useState<AppState>(initAppState)
  const TableHead = ['Book', 'Author', 'Price', 'Quantity', 'Actions'];

  const { isLoading, isError, errMsg } = appState;

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!isMounted) return;
      try {
        setAppState((prev) => ({ ...prev, isLoading: true }));
        const inventory = await bookServices.getBooks();
        setBooks(inventory);
      } catch (err: any) {
        setAppState((prev) => ({ ...prev, isError: true, errMsg: err.message }));
      } finally {
        setAppState((prev) => ({ ...prev, isLoading: false }));
      }
    })();

    return () => {
      isMounted = false;
    }
  }, [])

  console.log(books)

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
              {
                isLoading ?
                [...Array(8).keys()].map((index) => (
                  <LoadingBook key={index} />
                ))
                :
                isError ? (
                  <tr className='py-4 px-6 h-20 text-base text-center'>
                  <p className='text-red-400 translate-x-[50%]'>
                    {errMsg}
                  </p>
                </tr>
                ) 
                :
                books?.length ? (
                  books.map(book => (
                    <TableRow 
                      key={book.id}
                      book={book}
                      handleEditBook={handleEditBook}
                      formatCurrency={formatCurrency}
                    />
                  ))
                ) : <tr className='py-4 px-6 h-20 text-xl text-center'>
                  <p className='translate-x-[50%]'>
                    No books at the moment
                  </p>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}