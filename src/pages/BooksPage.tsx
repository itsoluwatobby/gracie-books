import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import Layout from '../components/layout/Layout';
import BookGrid from '../components/books/BookGrid';
import Button from '../components/ui/Button';
import { InitPriceRange } from '../utils/initVariables';
import { helper } from '../utils/helper';
import BookFilter from '../components/books/BookFilters';
import SortBy from '../components/books/filters/SortBy';
import { bookServices } from '../services';
import useBooksContext from '../context/useBooksContext';

const BooksPage: React.FC = () => {
  const { books } = useBooksContext() as BookContextType;
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [initPriceRange, setInitPriceRange] = useState<{ min: number, max: number }>(InitPriceRange);
  const [priceRange, setPriceRange] = useState<{ min: number, max: number }>(InitPriceRange);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('relevance');
  const allGenres = bookServices.getAllGenres(books);

  const { min, max } = priceRange;

  useEffect(() => {
    const initRange = InitPriceRange
    setInitPriceRange(initRange)
    setPriceRange(initRange)
  }, [])

  // Apply filters and sorting
  useEffect(() => {
    let result = [...books];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        book =>
          book.title.toLowerCase().includes(query) ||
          book.authors[0].toLowerCase().includes(query) ||
          book.description.toLowerCase().includes(query) ||
          book.genre.some((g: string) => g.toLowerCase().includes(query))
      );
    }

    // Filter by price range
    result = result.filter((book) => book.price >= min && book.price <= max);

    // Filter by genres
    if (selectedGenres.length > 0) {
      result = result.filter((book) =>
        book.genre.some((g: string) => selectedGenres.includes(g))
      );
    }

    // Sort books
    switch (sortBy) {
      case 'price-low-high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      // case 'bestselling':
      //   result.sort((a, b) => b?.rating - a?.rating);
      //   break;
      default:
        // 'relevance' - no specific sorting or sorted by search relevance
        break;
    }

    setFilteredBooks(result);
  }, [searchQuery, min, max, selectedGenres, books, sortBy]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams();
  };

  // Update search params
  const updateSearchParams = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    setSearchParams(params);
  };

  // Toggle a genre filter
  const toggleGenre = (genre: string) => {
    setSelectedGenres(prevGenres =>
      prevGenres.includes(genre)
        ? prevGenres.filter(g => g !== genre)
        : [...prevGenres, genre]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setPriceRange(initPriceRange);
    setSelectedGenres([]);
    setSortBy('relevance');
    setSearchParams({});
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Browse Books</h1>
          
          <div className="flex items-center md:hidden">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} className="mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">Filters</h2>
                <button 
                  onClick={clearFilters}
                  className="text-blue-700 text-sm hover:text-blue-900"
                >
                  Clear All
                </button>
              </div>

              <BookFilter 
                allGenres={allGenres}
                sortBy={sortBy}
                searchQuery={searchQuery}
                selectedGenres={selectedGenres}
                priceRange={priceRange}
                initPriceRange={initPriceRange}
                handleSearch={handleSearch}
                setSearchQuery={setSearchQuery}
                setShowFilters={setShowFilters}
                setPriceRange={setPriceRange}
                toggleGenre={toggleGenre}
                setSortBy={setSortBy}
              />

            </div>
          </div>

          {/* Filters - Mobile */}
          {showFilters ? (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex justify-end md:hidden">
              <div className="bg-white w-80 h-full overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-semibold">Filters</h2>
                  <button onClick={() => setShowFilters(false)}>
                    <X size={24} />
                  </button>
                </div>

                <BookFilter 
                  allGenres={allGenres}
                  sortBy={sortBy}
                  searchQuery={searchQuery}
                  selectedGenres={selectedGenres}
                  priceRange={priceRange}
                  initPriceRange={initPriceRange}
                  handleSearch={handleSearch}
                  setSearchQuery={setSearchQuery}
                  setShowFilters={setShowFilters}
                  setPriceRange={setPriceRange}
                  toggleGenre={toggleGenre}
                  setSortBy={setSortBy}
                />

                <div className="pt-4 border-t flex space-x-4">
                  <Button variant="outline" onClick={clearFilters}>
                    Clear All
                  </Button>
                  <Button onClick={() => setShowFilters(false)}>
                    Apply Filters
                  </Button>
                </div>
                
              </div>
            </div>
          ) : null}

          {/* Books Content */}
          <div className="flex-grow">
            {/* Active Filters */}
            {(searchQuery || min > 0 || max < initPriceRange.max || selectedGenres.length > 0) && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-blue-800">Active Filters:</h3>
                  <button 
                    onClick={clearFilters}
                    className="text-blue-700 text-sm hover:text-blue-900"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {searchQuery && (
                    <div className="bg-white rounded-full px-3 py-1 text-sm flex items-center">
                      <span className="mr-1">Search: {searchQuery}</span>
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  {(min > initPriceRange.min || max < initPriceRange.max) && (
                    <div className="bg-white rounded-full px-3 py-1 text-sm flex items-center">
                      <span className="mr-1">Price: {helper.formatPrice(min, 0)} - {helper.formatPrice(max, 0)}</span>
                      <button 
                        onClick={() => setPriceRange(initPriceRange)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  {selectedGenres.map((genre, index) => (
                    <div key={index} className="bg-white rounded-full px-3 py-1 text-sm flex items-center">
                      <span className="mr-1">{genre}</span>
                      <button 
                        onClick={() => toggleGenre(genre)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sort By - Mobile */}
            <div className="md:hidden mb-6">
              <SortBy sortBy={sortBy} setSortBy={setSortBy} />
            </div>

            {/* Results Summary */}
            <div className="mb-6 text-gray-600">
              Showing {filteredBooks.length} of {books.length} books
            </div>

            {/* Book Grid */}
            <BookGrid 
              books={filteredBooks}
              emptyMessage="No books found matching your filters. Try adjusting your search criteria."
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BooksPage;