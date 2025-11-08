import {
  Book, Building2,
  Calendar, ChevronLeft,
  ChevronRight, FileText,
  Search, Star, User, X,
} from "lucide-react";
import { useState } from "react";

interface BookResultPreveiwProps {
  searchResults: Book[];
  currentSlide: number;
  selectBook: (book: Book) => void;
  setCurrentSlide: React.Dispatch<React.SetStateAction<number>>;
  setShowSearchResults: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BookResultPreveiw: React.FC<BookResultPreveiwProps> = (
  {
    searchResults, currentSlide,
    selectBook, setCurrentSlide,
    setShowSearchResults,
  },
  ) => {
  const [isImageDisplayed, setIsImageDisplayed] = useState(true);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % searchResults.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + searchResults.length) % searchResults.length);
  };
  
  return (
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
                  src={isImageDisplayed ? searchResults[currentSlide].coverImage : searchResults[currentSlide].icon}
                  alt={searchResults[currentSlide].title}
                  onError={() => setIsImageDisplayed(false)}
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
                {
                  <p className="text-gray-600 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {searchResults[currentSlide].authors?.join(',')}
                  </p>

                }
                
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
                  {
                    searchResults[currentSlide]?.publicationDate ?
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {new Date(searchResults[currentSlide].publicationDate).getFullYear()}
                    </div>
                    : null
                  }
                </div>
                
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {searchResults[currentSlide].description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {searchResults[currentSlide]?.genre?.map((g, idx) => (
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
  );
}