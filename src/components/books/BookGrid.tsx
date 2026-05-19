/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import BookCard from './BookCard';
import { BookOpen } from 'lucide-react';

interface BookGridProps {
  books: Book[];
  title?: string;
  emptyMessage?: string | null;
  // from?: 'Home';
}

const BookGrid: React.FC<BookGridProps> = ({ 
  books, 
  title,
  emptyMessage = null,
}) => {
  return (
    <div className="w-full just">
      {title ? (
        <h2 className="text-2xl font-bold mb-6 text-blue-900">{title}</h2>
      ) : null}
      
      {!books?.length ? (
        <div className="py-12 flex justify-center items-center">
          {
            emptyMessage ?
            <p className="text-gray-500 text-xl">{emptyMessage}</p>
            : <BookOpen size={24} className="text-red-700 mx-auto" />
        }
        </div>
      ) : (
        <div className="grid grid-cols-3 max-sm:grid-cols-2 max-xxs:grid-cols-1 lg:grid-cols-4 xlgrid-cols-5 gap-6">
        {/* // <div className="flex items-center flex-wrap gap-6"> */}
          {books.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookGrid;