import React from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { helper } from '../../utils/helper';

interface BookCardProps {
  itemCount?: number;
}

const BookCardLoading: React.FC<BookCardProps> = ({ itemCount = 6 }) => {

  return (
    <div className="grid grid-cols-3 max-xs:grid-cols-2 max-xxxs:grid-cols-1 lg:grid-cols-4 xl:grid-cols-6 gap-6">
      {
        [...Array(itemCount).keys()].map((_, index) => (
          <Card 
            key={index}
            hoverable 
            className="h-full flex flex-col transition-all duration-300 border border-transparent hover:border-blue-200"
          >
            <div className="flex flex-col h-full">
              <div className="relative pt[120%] bg-gray-200 h-40 animate-pulse duration-300">
                <div className="absolute top-2 right-2">
                  <button className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                    <Heart size={18} className="text-gray-500 hover:text-red-500 transition-colors" />
                  </button>
                </div>
              </div>
              
              <div className="p-2 flex-grow flex flex-col">
                <h3 className="bg-gray-200 animate-pulse duration-300 w-[60%] rounded-sm h-6 mb-1"></h3>
                <p className="bg-gray-200 animate-pulse duration-300 w-[30%] rounded-sm h-6 mb-2"></p>
                
                <div className="mt-auto">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        // className={`w-4 h-4 text-gray-300`} 
                        className={`w-4 h-4 ${i < Math.floor(5) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-xs text-gray-600 ml-1">5</span>
                  </div>

                  <div className="my-2">
                    <div className="bg-gray-100 px-2 py-1 rounded h-5 animate-pulse duration-300 w-[20%]">
                    </div>
                  </div>
                  
                  <div className="flex gap1.5 mt-2.5 justify-between items-center">
                    <span className="text-lg font-semibold text-blue-900">{helper.formatPrice(0)}</span>

                    <Button 
                      type='button'
                      size="sm"
                      variant="primary" 
                      className="self-end flex items-center w-fit space-x-1 rounded-full px-3"
                    >
                      <ShoppingCart size={16} />
                      <span>Add</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))
      }
    </div>
  );
};

export default BookCardLoading;