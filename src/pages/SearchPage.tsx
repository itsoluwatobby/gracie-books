import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import Layout from '../components/layout/Layout';
import BookGrid from '../components/books/BookGrid';
import { searchBooks, getAllGenres } from '../data/books';
import { Book } from '../types';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const allGenres = getAllGenres();
  
  // Get count of books in each genre from search results
  const genreCounts = books.reduce((counts: Record<string, number>, book) => {
    book.genre.forEach(genre => {
      counts[genre] = (counts[genre] || 0) + 1;
    });
    return counts;
  }, {});

  useEffect(() => {
    setLoading(true);
    
    // Add a small timeout to simulate an API request
    const timer = setTimeout(() => {
      const results = searchBooks(query);
      setBooks(results);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-blue-900 mb-4">
            Search Results for "{query}"
          </h1>
          
          <div className="relative max-w-xl mb-4">
            <form action="/search" method="get">
              <div className="flex rounded-md shadow-sm">
                <div className="relative flex-grow focus-within:z-10">
                  <input
                    type="text"
                    name="q"
                    defaultValue={query}
                    className="block w-full rounded-none rounded-l-md border-gray-300 pl-4 pr-10 py-3 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Search for books, authors, genres..."
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                </div>
                <button
                  type="submit"
                  className="relative -ml-px inline-flex items-center rounded-r-md border border-blue-900 bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:border-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-700"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
          
          <p className="text-gray-600">
            {loading ? (
              "Searching..."
            ) : (
              `Found ${books.length} result${books.length !== 1 ? 's' : ''} for "${query}"`
            )}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar with genre filters */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="font-semibold mb-4 text-blue-900">Filter by Genre</h2>
              <div className="space-y-2">
                {allGenres.map((genre, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <Link
                      to={`/genres/${genre}`}
                      className="text-gray-700 hover:text-blue-700"
                    >
                      {genre}
                    </Link>
                    {genreCounts[genre] ? (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {genreCounts[genre]}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Search results */}
          <div className="flex-grow">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
              </div>
            ) : (
              <BookGrid 
                books={books}
                emptyMessage={`No books found matching "${query}". Try a different search term.`}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;