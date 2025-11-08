import React from 'react';
import BookCard from './BookCard';

interface BookGridProps {
  books: Book[];
  title?: string;
  emptyMessage?: string;
  // from?: 'Home';
}

const BookGrid: React.FC<BookGridProps> = ({ 
  books, 
  title,
  emptyMessage = 'No books found.',
}) => {
  return (
    <div className="w-full">
      {title ? (
        <h2 className="text-2xl font-bold mb-6 text-blue-900">{title}</h2>
      ) : null}
      
      {!books?.length ? (
        <div className="text-center py-12">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 max-xs:grid-cols-2 max-xxxs:grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {books.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookGrid;