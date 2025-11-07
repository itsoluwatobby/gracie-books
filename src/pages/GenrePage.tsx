import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import BookGrid from '../components/books/BookGrid';
import { bookServices } from '../services';
import useBooksContext from '../context/useBooksContext';

const GenrePage: React.FC = () => {
  const { genre } = useParams<{ genre: string }>();
  const { books } = useBooksContext() as BookContextType;

  const filteredBooks = bookServices.filterBooksByGenre(genre!, books);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
          {genre} Books
        </h1>
        
        <BookGrid 
          books={filteredBooks}
          emptyMessage={`No books found in the ${genre} genre.`}
        />
      </div>
    </Layout>
  );
};

export default GenrePage;