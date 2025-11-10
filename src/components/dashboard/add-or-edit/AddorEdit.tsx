/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react'

import { InitBookForm } from '../../../utils/initVariables';
import {
  X, Search, Loader2,
  Book, FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { bookServices } from '../../../services';
import CSVUploader from '../../ui/CSVUploader';
import { BookResultPreveiw } from './BookResultPreview';
import { BookForm } from './Bookform';
import { CSVBookData } from '../../../utils/csvProcessor';

type AddorEditProps = {
  editBook: Book | null;
  setShowBookModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditBook: React.Dispatch<React.SetStateAction<Book | null>>;
  setReload: React.Dispatch<React.SetStateAction<Reloads>>;
}

export default function AddorEdit(
  {
    editBook,
    setShowBookModal,
    setEditBook,
    setReload,
  }: AddorEditProps
) {
  const [bookForm, setBookForm] = useState<Partial<Book>>(InitBookForm);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Partial<Book>[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const [isSearching, setIsSearching] = useState(false);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [showCSVUploader, setShowCSVUploader] = useState(false);

  useEffect(() => {
    if (editBook) {
      setBookForm(editBook);
      // setEditBook(null);
    }
  }, [editBook, setEditBook])

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
      const googleResults = await bookServices.fetchBookDetails(query);
      setSearchResults(googleResults);
      setShowSearchResults(true);
      setCurrentSlide(0);
    } catch (error: any) {
      toast.error(`Failed to search books. ERROR - ${error.message}`);
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => searchBooks(query), 1000),
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

  const selectBook = (book: Book) => {
    setBookForm({ ...bookForm, ...book });
    setShowSearchResults(false);
    setSearchQuery('');
    toast.success('Book details prefilled!');
  };

  const handleCSVData = async (csvData: CSVBookData[]) => {
    try {
      // Process each book from CSV
      const results = await Promise.allSettled(
        csvData.map(async (bookData) => {
          const { title, author } = bookData;
          const books = await bookServices.fetchBookDetails(`${title} by ${author}`);
          if (books?.length) {
            books[0].price = bookData?.price ?? 0;
            books[0].stockQuantity = bookData?.stockQuantity ?? 1;
          }
          return books[0]
        })
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

  const closeModal = () => {
    setEditBook(null);
    setShowBookModal(false);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-[90%] max-w-3xl max-h-[95vh] overflow-hidden shadow-2xl">
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
                onClick={closeModal}
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
                    disabled={isSearching}
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
            {
              (showSearchResults && searchResults?.length > 0) ? (
                <BookResultPreveiw 
                  currentSlide={currentSlide}
                  searchResults={searchResults as Book[]}
                  selectBook={selectBook}
                  setCurrentSlide={setCurrentSlide}
                  setShowSearchResults={setShowSearchResults}
                />
              ) : null
            }

            {/* Form */}
            <BookForm 
              editBook={editBook}
              setEditBook={setEditBook}
              bookForm={bookForm}
              setBookForm={setBookForm}
              setShowBookModal={setShowBookModal}
              setReload={setReload}
            />
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