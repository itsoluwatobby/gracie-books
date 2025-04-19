import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, X } from 'lucide-react';
import Layout from '../components/layout/Layout';
import BookGrid from '../components/books/BookGrid';
import Button from '../components/ui/Button';
import { books, getAllGenres } from '../data/books';

const BooksPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('relevance');
  const allGenres = getAllGenres();

  // Apply filters and sorting
  useEffect(() => {
    let result = [...books];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        book =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.description.toLowerCase().includes(query) ||
          book.genre.some((g: string) => g.toLowerCase().includes(query))
      );
    }

    // Filter by price range
    result = result.filter(
      book => book.price >= priceRange[0] && book.price <= priceRange[1]
    );

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
        result.sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
        break;
      case 'bestselling':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // 'relevance' - no specific sorting or sorted by search relevance
        break;
    }

    setFilteredBooks(result);
  }, [searchQuery, priceRange, selectedGenres, sortBy]);

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
    setPriceRange([0, 50]);
    setSelectedGenres([]);
    setSortBy('relevance');
    setSearchParams({});
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Browse Books</h1>
          
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center md:hidden"
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

              {/* Search */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Search</h3>
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search books..."
                    className="w-full border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-800 text-white p-2 rounded-r hover:bg-blue-700 transition-colors"
                  >
                    <Search size={18} />
                  </button>
                </form>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
                <div className="flex items-center">
                  <span className="text-gray-600">$</span>
                  <input
                    type="number"
                    min="0"
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-20 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="mx-2">-</span>
                  <span className="text-gray-600">$</span>
                  <input
                    type="number"
                    min={priceRange[0]}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-20 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full mt-2"
                />
              </div>

              {/* Genres */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Genres</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {allGenres.map((genre, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`genre-${index}`}
                        checked={selectedGenres.includes(genre)}
                        onChange={() => toggleGenre(genre)}
                        className="mr-2"
                      />
                      <label htmlFor={`genre-${index}`} className="text-sm text-gray-700">
                        {genre}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="bestselling">Bestselling</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filters - Mobile */}
          {showFilters && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex justify-end md:hidden">
              <div className="bg-white w-80 h-full overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-semibold">Filters</h2>
                  <button onClick={() => setShowFilters(false)}>
                    <X size={24} />
                  </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Search</h3>
                  <form onSubmit={handleSearch} className="flex items-center">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search books..."
                      className="w-full border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-blue-800 text-white p-2 rounded-r hover:bg-blue-700 transition-colors"
                    >
                      <Search size={18} />
                    </button>
                  </form>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
                  <div className="flex items-center">
                    <span className="text-gray-600">$</span>
                    <input
                      type="number"
                      min="0"
                      max={priceRange[1]}
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-20 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="mx-2">-</span>
                    <span className="text-gray-600">$</span>
                    <input
                      type="number"
                      min={priceRange[0]}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-20 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full mt-2"
                  />
                </div>

                {/* Genres */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Genres</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {allGenres.map((genre, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`mobile-genre-${index}`}
                          checked={selectedGenres.includes(genre)}
                          onChange={() => toggleGenre(genre)}
                          className="mr-2"
                        />
                        <label htmlFor={`mobile-genre-${index}`} className="text-sm text-gray-700">
                          {genre}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="newest">Newest Arrivals</option>
                    <option value="bestselling">Bestselling</option>
                  </select>
                </div>

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
          )}

          {/* Books Content */}
          <div className="flex-grow">
            {/* Active Filters */}
            {(searchQuery || priceRange[0] > 0 || priceRange[1] < 50 || selectedGenres.length > 0) && (
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
                  {(priceRange[0] > 0 || priceRange[1] < 50) && (
                    <div className="bg-white rounded-full px-3 py-1 text-sm flex items-center">
                      <span className="mr-1">Price: ${priceRange[0]} - ${priceRange[1]}</span>
                      <button 
                        onClick={() => setPriceRange([0, 50])}
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
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="relevance">Sort by: Relevance</option>
                <option value="price-low-high">Sort by: Price: Low to High</option>
                <option value="price-high-low">Sort by: Price: High to Low</option>
                <option value="newest">Sort by: Newest Arrivals</option>
                <option value="bestselling">Sort by: Bestselling</option>
              </select>
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