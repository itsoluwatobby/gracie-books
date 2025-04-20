import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import useCartContext from '../../context/useCartContext';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { addToCart } = useCartContext();
  
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
        <div className="relative pt[120%] bg-gray-100 h-40">
          <img 
            src={book.coverImage}
            alt={book.title}
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 hover:scale-[1.005]"
          />
          <div className="absolute top-2 right-2">
            <button className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
              <Heart size={18} className="text-gray-500 hover:text-red-500 transition-colors" />
            </button>
          </div>
        </div>
        
        <div className="p-2 flex-grow flex flex-col">
          <h3 className="font-medium text-lg line-clamp-1">{book.title}</h3>
          <p className="text-gray-600 text-sm mb-2">{book.author}</p>
          
          <div className="mt-auto">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(book.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-xs text-gray-600 ml-1">({book.rating.toFixed(1)})</span>
            </div>
            
            <div className="flex gap1.5 mt-2.5 justify-between items-center">
              <div className="flex itemsbaseline mb3">
                <span className="text-lg font-bold text-blue-900">${book.price.toFixed(2)}</span>
                {book.stockQuantity < 5 && book.stockQuantity > 0 && (
                  <span className="ml-2 text-xs text-orange-600">Only {book.stockQuantity} left</span>
                )}
                {book.stockQuantity === 0 && (
                  <span className="ml-2 text-xs text-red-600">Out of stock</span>
                )}
              </div>

              <Button 
                size="sm" 
                variant="primary" 
                className="self-end flex items-center w-fit space-x-1 rounded-full px-3"
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