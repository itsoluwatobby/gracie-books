import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import BookGrid from '../components/books/BookGrid';
import { useGetBooks } from '../hooks/useGetBooks';
import BookCardLoading from '../components/Loaders/BookCardLoading';

const GenrePage: React.FC = () => {
  const location = useLocation();
  const [genre, setGenre] = useState<string | null>(null);
  const { booksData, appState } = useGetBooks(
    { pagination: { pageSize: 50 }, genre: genre },
  )

  useEffect(() => {
    if (location.search) {
      const value = decodeURI(location.search?.split("=")[1]);
      setGenre(value);
    }
  }, [location.search])

  return (
    <Layout>
      <div className="container lg:max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
          {genre !== 'undefined' ? genre : null} Books
        </h1>
        
        {
          appState?.isLoading 
          ? <BookCardLoading itemCount={8} />  
          : <BookGrid 
              books={booksData.books}
              emptyMessage={genre ? `No books found in the ${genre} genre.` : 'No genre provided'}
            />
        }
      </div>
    </Layout>
  );
};

export default GenrePage;