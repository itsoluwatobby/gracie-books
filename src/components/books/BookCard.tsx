import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import useCartContext from '../../context/useCartContext';
import { helper } from '../../utils/helper';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { addToCart } = useCartContext();
  const [isImageDisplayed, setIsImageDisplayed] = useState(true);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(book, 1);
  };

  return (
    <Card 
      hoverable 
      className="h-full flex flex-col transition-all duration-300 border border-transparent hover:border-blue-200"
    >
      <Link to={`/books/${book.id}`} className="flex flex-col h-full">
        <div className="relative h-56 perspective-1000">
          <div className="absolute inset-0 transform-gpu transition-transform duration-500 hover:rotate-y-4 hover:-translate-y-0.5 hover:scale-[1.005] hover:shadow-xl rounded-b-md">
            {/* 3D Book Container with Spine & Cover */}
            <div className="relative w-full h-full preserve-3d group flex items-center gap-0.5">
              <img
                src={isImageDisplayed ? book?.coverImage : book?.icon}
                alt={book.title}
                onError={() => setIsImageDisplayed(false)}
                className="w-full h-full shrink-0 object-contain object-scale-dow"
              />
            
              {/* Inner Shadow Overlay for Depth */}
              <div className="absolute inset-0 backface-hidden rounded-lg shadow-inner pointer-events-none opacity-30"></div>
            </div>
          </div>

          {/* Floating Heart Button with 3D Pop */}
          <div className="absolute top-3 right-3 z-10">
            <button className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transform-gpu transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 hover:bg-red-50 border border-gray-200">
              <Heart
                size={18}
                className="text-gray-600 transition-colors group-hover:fill-red-500 group-hover:text-red-500"
              />
            </button>
          </div>

        </div>
        
        <div className="p-2 flex-grow flex flex-col">
          <h3 className="font-medium text-base max-xs:text-sm line-clamp-1 min-w-0 flex-1">{book.title}</h3>
          <p className="text-gray-600 text-sm max-xs:text-xs mb-1">by {book?.authors[0]}</p>
          
          <div className="mt-auto">
             {/* Genre Tags */}
            <div className="flex flex-wrap items-center gap-1 mb-3">
              {book.genre.slice(0, 2).map((genre, index) => (
                <span 
                  key={index}
                  className="text-xs max-xs:text-[9px] bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium"
                >
                  {genre}
                </span>
              ))}
              <span className={`max-xs:text-[9px] text-xs px-2 py-1 rounded-full font-medium ${
                book.hardBack 
                  ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                  : 'bg-gray-50 text-gray-700 border border-gray-200'
              }`}>
                {book.hardBack ? 'Hardcover' : 'Paperback'}
              </span>
            </div>
            {/* <div className="hidden items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-4 h-4 text-gray-300`} 
                  // className={`w-4 h-4 ${i < Math.floor(book?.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              {book?.rating ? <span className="text-xs text-gray-600 ml-1">({book.rating.toFixed(1)})</span> : null}
            </div> */}

            <div className="my-1">
              {book.stockQuantity === 0 ? (
                <span className="text-xs max-xs:text-[11px] text-red-600 font-medium bg-red-50 px-2 py-1 rounded">
                  Sold Out
                </span>
              ) : book.stockQuantity < 3 ? (
                <span className="text-xs max-xs:text-[11px] text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded">
                  Only {book.stockQuantity} left
                </span>
              ) : (
                <span className="text-xs max-xs:text-[11px] text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                  {book.stockQuantity} in stock
                </span>
              )}
            </div>
            
            <div className="flex max-xs:flex-col max-xs:gap-1.5 mt-1.5 justify-between w-full">
              <p className="xs:self-end text-sm font-semibold text-blue-900">{helper.formatPrice(book.price)}</p>
              
              <Button
                size="sm"
                variant="primary"
                className="self-end flex items-center w-fit max-xs:w-1/2 max-xs:justify-center space-x-1 rounded-full px-3 max-xs:px-2.5"
                onClick={handleAddToCart}
                disabled={book.stockQuantity === 0}
              >
                <ShoppingCart size={16} />
                <span>Add</span>
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default BookCard;