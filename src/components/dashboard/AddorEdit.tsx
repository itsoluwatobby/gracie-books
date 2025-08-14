/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FormEvent, useState, useEffect, useCallback } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { InitBookForm } from '../../utils/initVariables';
import { X, Search, Book, Star, Calendar, User, Hash, Building2, FileText, DollarSign, Package, Image, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { bookServices } from '../../schema';
import { books } from '../../data/books';
import CSVUploader from '../ui/CSVUploader';

type BookSearchResult = {
  id: string;
  title: string;
  authors: string[];
  description: string;
  coverImage: string;
  isbn: string;
  publisher: string;
  publicationDate: string;
  pageCount: number;
  rating: number;
  genre: string[];
  source: 'google' | 'goodreads';
}

type AddorEditProps = {
  editBook: Book | null;
  setShowBookModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditBook: React.Dispatch<React.SetStateAction<Book | null>>;
}

export default function AddorEdit(
  {
    editBook, setShowBookModal,
    setEditBook,
  }: AddorEditProps
) {
  const [bookForm, setBookForm] = useState<Partial<Book>>(books[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showCSVUploader, setShowCSVUploader] = useState(false);

  // Debounced search function
  const debounce = (func: (...args: any) => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const searchBooks = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      // Mock API calls - replace with actual API implementations
      const googleResults = await bookServices.fetchBookDetails(query);
      const goodreadsResults = await searchGoodreadsBooks(query);
      
      console.log(googleResults);
      // const googleResults = await searchGoogleBooks(query);
      // const goodreadsResults = await searchGoodreadsBooks(query);
      
      const combinedResults = [...googleResults, ...goodreadsResults];
      setSearchResults(combinedResults);
      setShowSearchResults(true);
      setCurrentSlide(0);
    } catch (error: any) {
      console.log(error)
      toast.error('Failed to search books');
    } finally {
      setIsSearching(false);
    }
  };

  // Mock Google Books API search
  const searchGoogleBooks = async (query: string): Promise<BookSearchResult[]> => {
    // Replace with actual Google Books API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'google-1',
            title: query,
            authors: ['Sample Author'],
            description: 'A fascinating book about...',
            coverImage: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300',
            isbn: '9781234567890',
            publisher: 'Sample Publisher',
            publicationDate: '2023-01-01',
            pageCount: 300,
            rating: 4.5,
            genre: ['Fiction', 'Adventure'],
            source: 'google'
          }
        ]);
      }, 1000);
    });
  };

  // Mock Goodreads API search
  const searchGoodreadsBooks = async (query: string): Promise<BookSearchResult[]> => {
    // Replace with actual Goodreads API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'goodreads-1',
            title: query + ' (Goodreads Edition)',
            authors: ['Another Author'],
            description: 'An excellent read that explores...',
            coverImage: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300',
            isbn: '9780987654321',
            publisher: 'Goodreads Publisher',
            publicationDate: '2023-06-15',
            pageCount: 250,
            rating: 4.2,
            genre: ['Non-fiction', 'Biography'],
            source: 'goodreads'
          }
        ]);
      }, 1200);
    });
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => searchBooks(query), 500),
    []
  );

  useEffect(() => {
    if (searchQuery.length > 2) {
      debouncedSearch(searchQuery);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery, debouncedSearch]);

  const selectBook = (book: BookSearchResult) => {
    setBookForm({
      ...bookForm,
      title: book.title,
      authors: book.authors,
      description: book.description,
      coverImage: book.coverImage,
      isbn: book.isbn,
      publisher: book.publisher,
      publicationDate: book.publicationDate,
      pageCount: book.pageCount,
      rating: book.rating,
      genre: book.genre,
    });
    setShowSearchResults(false);
    setSearchQuery('');
    toast.success('Book details filled automatically!');
  };

  const handleCSVData = async (csvData: any[]) => {
    try {
      // Process each book from CSV
      const results = await Promise.allSettled(
        csvData.map(async (bookData) => bookServices.addBook(bookData))
      );
      
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;
      
      if (successful > 0) {
        toast.success(`Successfully imported ${successful} books!`);
      }
      if (failed > 0) {
        toast.error(`Failed to import ${failed} books. Check console for details.`);
      }
      
      // Log failed imports for debugging
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Failed to import book at row ${index + 1}:`, result.reason);
        }
      });
      
    } catch (error) {
      toast.error('Failed to process CSV data');
      console.error('CSV processing error:', error);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % searchResults.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + searchResults.length) % searchResults.length);
  };

  const handleBookFormSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const book = await bookServices.addBook(bookForm);
      console.log(book);
      setEditBook(null);
      setBookForm(InitBookForm);

      toast.success(`${book.title} uploaded`);
      // setShowBookModal(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Book className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">
                  {editBook ? 'Edit Book' : 'Add New Book'}
                </h2>
                <p className="text-blue-100 text-sm">
                  {editBook ? 'Update book information' : 'Search and add books to your collection'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!editBook && (
                <button 
                  onClick={() => setShowCSVUploader(true)}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Upload CSV
                </button>
              )}
              <button 
                onClick={() => setShowBookModal(false)}
                className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors duration-200"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
          <div className="p-6">
            {/* Search Section */}
            {!editBook && (
              <div className="mb-8">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search for books by title, author, or ISBN..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                  {isSearching && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                  <span>💡</span>
                  Start typing to search books from Google Books and Goodreads
                </p>
              </div>
            )}

            {/* Search Results Popup */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="mb-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Search className="w-5 h-5 text-blue-600" />
                    Search Results ({searchResults.length} found)
                  </h3>
                  <button
                    onClick={() => setShowSearchResults(false)}
                    className="text-gray-500 hover:text-gray-700 p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="relative">
                  <div className="bg-white rounded-lg p-6 shadow-lg border">
                    {searchResults[currentSlide] && (
                      <div className="flex gap-6">
                        <div className="flex-shrink-0">
                          <img
                            src={searchResults[currentSlide].coverImage}
                            alt={searchResults[currentSlide].title}
                            className="w-32 h-48 object-cover rounded-lg shadow-md"
                          />
                          <div className="mt-2 text-center">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              searchResults[currentSlide].source === 'google' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {searchResults[currentSlide].source === 'google' ? 'Google Books' : 'Goodreads'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-800 mb-2">
                            {searchResults[currentSlide].title}
                          </h4>
                          <p className="text-gray-600 mb-3 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {searchResults[currentSlide].authors.join(',')}
                          </p>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Star className="w-4 h-4 text-yellow-500" />
                              {searchResults[currentSlide].rating}/5
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <FileText className="w-4 h-4" />
                              {searchResults[currentSlide].pageCount} pages
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Building2 className="w-4 h-4" />
                              {searchResults[currentSlide].publisher}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              {new Date(searchResults[currentSlide].publicationDate).getFullYear()}
                            </div>
                          </div>
                          
                          <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                            {searchResults[currentSlide].description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {searchResults[currentSlide].genre.map((g, idx) => (
                              <span key={idx} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                                {g}
                              </span>
                            ))}
                          </div>
                          
                          <button
                            onClick={() => selectBook(searchResults[currentSlide])}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2"
                          >
                            <Book className="w-4 h-4" />
                            Use This Book
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation */}
                  {searchResults.length > 1 && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      </button>
                    </>
                  )}

                  {/* Dots indicator */}
                  {searchResults.length > 1 && (
                    <div className="flex justify-center mt-4 gap-2">
                      {searchResults.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentSlide(idx)}
                          className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                            idx === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleBookFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
                    <Book className="w-5 h-5 text-blue-600" />
                    Basic Information
                  </h3>
                  
                  <Input
                    label="Title"
                    value={bookForm.title}
                    onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                    required
                    icon={<Book className="w-4 h-4" />}
                  />
                  
                  <Input
                    label="Author"
                    value={bookForm.authors?.join(',')}
                    onChange={(e) => setBookForm({ ...bookForm, authors: [...bookForm.authors!, e.target.value] })}
                    required
                    icon={<User className="w-4 h-4" />}
                  />
                  
                  <div>
                    <label className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      Description
                    </label>
                    <textarea
                      value={bookForm.description}
                      onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={4}
                      placeholder="Enter book description..."
                      required
                    />
                  </div>
                </div>

                {/* Publication Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
                    <Building2 className="w-5 h-5 text-purple-600" />
                    Publication Details
                  </h3>
                  
                  <Input
                    label="ISBN"
                    value={bookForm.isbn}
                    onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                    required
                    icon={<Hash className="w-4 h-4" />}
                  />
                  
                  <Input
                    label="Publisher"
                    value={bookForm.publisher}
                    onChange={(e) => setBookForm({ ...bookForm, publisher: e.target.value })}
                    required
                    icon={<Building2 className="w-4 h-4" />}
                  />
                  
                  <Input
                    label="Publication Date"
                    type="date"
                    value={bookForm.publicationDate}
                    onChange={(e) => setBookForm({ ...bookForm, publicationDate: e.target.value })}
                    required
                    icon={<Calendar className="w-4 h-4" />}
                  />
                  
                  <Input
                    label="Page Count"
                    type="number"
                    value={bookForm.pageCount}
                    onChange={(e) => setBookForm({ ...bookForm, pageCount: parseInt(e.target.value) })}
                    required
                    icon={<FileText className="w-4 h-4" />}
                  />
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Input
                  label="Price ($)"
                  type="number"
                  step="0.01"
                  value={bookForm.price}
                  onChange={(e) => setBookForm({ ...bookForm, price: parseFloat(e.target.value) })}
                  required
                  icon={<DollarSign className="w-4 h-4" />}
                />
                
                <Input
                  label="Stock Quantity"
                  type="number"
                  value={bookForm.stockQuantity}
                  onChange={(e) => setBookForm({ ...bookForm, stockQuantity: parseInt(e.target.value) })}
                  required
                  icon={<Package className="w-4 h-4" />}
                />
                
                <Input
                  label="Rating (0-5)"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={bookForm.rating}
                  onChange={(e) => setBookForm({ ...bookForm, rating: parseFloat(e.target.value) })}
                  required
                  icon={<Star className="w-4 h-4" />}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Input
                  label="Cover Image URL"
                  value={bookForm.coverImage}
                  onChange={(e) => setBookForm({ ...bookForm, coverImage: e.target.value })}
                  required
                  icon={<Image className="w-4 h-4" />}
                />
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Genres (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={bookForm.genre?.join(', ')}
                    onChange={(e) => setBookForm({ ...bookForm, genre: e.target.value.split(',').map(g => g.trim()) })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Fiction, Adventure, Mystery..."
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setShowBookModal(false)}
                  type="button"
                  className="px-6 py-3"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {editBook ? 'Save Changes' : 'Add Book'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* CSV Uploader Modal */}
      {showCSVUploader && (
        <CSVUploader
          onDataProcessed={handleCSVData}
          onClose={() => setShowCSVUploader(false)}
        />
      )}
    </div>
  )
}