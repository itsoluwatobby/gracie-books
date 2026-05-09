import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import BookGrid from '../components/books/BookGrid';
import { useGetBooks } from '../hooks/useGetBooks';
import BookCardLoading from '../components/Loaders/BookCardLoading';
import { MetaTags } from '../components/layout/OGgraph';

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
      <MetaTags
        title={genre && genre !== 'undefined' ? `${genre} Books` : 'Browse by Genre'}
        description={genre && genre !== 'undefined' ? `Discover the best ${genre} books. Browse our full ${genre} collection.` : 'Browse books by genre. Find your favourite category.'}
        keywords={genre && genre !== 'undefined' ? `${genre} books, ${genre}, buy ${genre}` : 'book genres, browse books'}
      />
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