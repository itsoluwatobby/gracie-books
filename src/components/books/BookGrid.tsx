import React from 'react';
import BookCard from './BookCard';

interface BookGridProps {
  books: Book[];
  title?: string;
  emptyMessage?: string;
}

const BookGrid: React.FC<BookGridProps> = ({ 
  books, 
  title,
  emptyMessage = 'No books found.'
}) => {
  return (
    <div className="w-full">
      {title && (
        <h2 className="text-2xl font-bold mb-6 text-blue-900">{title}</h2>
      )}
      
      {books.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-6">
          {books.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookGrid;