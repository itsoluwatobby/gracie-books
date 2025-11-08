/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  Share2,
  Bookmark,
  Star,
  ChevronRight,
  LoaderIcon,
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import useCartContext from '../context/useCartContext';
import BookGrid from '../components/books/BookGrid';
import { bookServices } from '../services';
import { initAppState } from '../utils/initVariables';
import toast from 'react-hot-toast';
import useBooksContext from '../context/useBooksContext';

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const { reload, books } = useBooksContext() as BookContextType;
  const { addToCart } = useCartContext();

  const [isImageDisplayed, setIsImageDisplayed] = useState(true);
  const [appState, setAppState] = useState<AppState>(initAppState);
  
  const { isLoading, isError, errMsg } = appState;
  

  // Get related books (for demo purposes, just random books)
  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!isMounted || !id) return;
      try {
        setAppState((prev) => ({ ...prev, isLoading: true }));
        const inventory = await bookServices.getBookById(id);
        setBook(inventory);
      } catch (err: any) {
        setAppState((prev) => ({ ...prev, isError: true, errMsg: err.message }));
      } finally {
        setAppState((prev) => ({ ...prev, isLoading: false }));
      }
    })();

    return () => {
      isMounted = false;
    }
  }, [reload.cart_reload, id])

  const relatedBooks = books
    .filter(b => b.id !== id && b.genre.some((g: string) => book?.genre.includes(g)))
    .slice(0, 4);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (!book) return;
    if (quantity < book.stockQuantity) {
      setQuantity(quantity + 1);
    }
  };
  
  const handleAddToCart = () => {
    if (!book) return;
    // console.log(book, quantity)
    addToCart(book, quantity);
  };

  const shareBook = async () => {
    if (!book) return;

    const shareData = {
      title: book.title,
      text: 'Wandyte book sales have some hot deals on ground. Check this out!',
      url: `${window.origin}/books/${book.id}`
    };
  
   if (navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        toast.success("Content shared successfully!");
      } catch (error: any) {
        toast.error(`Error sharing content: ${error.message}`);
      }
    } else {
      console.log("Web Share API not supported or invalid share data.");
      // Fallback: You could copy the URL to clipboard or show a message
      alert("Sharing is not supported on this device. Copy this link: " + shareData.url);
    }
  };

  return (
    <Layout>
      <div className="container lg:max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <ol className="flex text-sm text-gray-500">
            <li>
              <Link to="/" className="hover:text-blue-700">Home</Link>
            </li>
            <li className="mx-2">
              <ChevronRight size={14} />
            </li>
            <li>
              <Link to="/books" className="hover:text-blue-700">Books</Link>
            </li>
            <li className="mx-2">
              <ChevronRight size={14} />
            </li>
            <li>
              <Link
                to={`/genres?genre=${book?.genre[0]}`}
                className="hover:text-blue-700"
              >
                {book?.genre[0]}
              </Link>
            </li>
            <li className="mx-2">
              <ChevronRight size={14} />
            </li>
            <li className="text-gray-700 font-medium">
              {book?.title}
            </li>
          </ol>
        </nav>

        {/* Book Details */}
      {
        isLoading ? (
          <div className='w-full grid place-content-center h-96'>
            <LoaderIcon size={48} className='animate-spin duration-1000' />
          </div>
        ) : 
        isError ? (
          <div className="container mx-auto px-4 py-12">
            <div className="text-center py-12">
              <p className="text-gray-500">Book not found. <span className='text-red'>{errMsg}</span></p>
            </div>
          </div>
        ) : (
          book &&
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Book Cover Image */}
              <div className="w-full md:w-1/3 lgw-1/4">
                <div className="h-96 rounded-md transform-gpu transition-transform duration-500 hover:rotate-y-4 hover:-translate-y-0.5 hover:scale-[1.005] hover:shadow-xl">
                  {/* 3D Book Container with Spine & Cover */}
                  <div className="rounded-md relative w-full h-full preserve-3d group">
                    {/* Book Cover */}
                    <div className="absolute inset-0 backface-hidden rounded-lg overflow-hidden">
                      <img
                        src={isImageDisplayed ? book?.coverImage : book?.icon}
                        alt={book.title}
                        onError={() => setIsImageDisplayed(false)}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="absolute rounded-l-md left-0 top-0 w-20 h-full origin-left backface-hidden rotate-y-90 bg-gradient-to-r from-gray-300 to-gray-400 shadow-inner">
                      <div className="flex flex-col justify-center items-center h-full text-xs text-gray-700 font-semibold writing-mode-vertical transform -rotate-180">
                        {book.title}
                      </div>
                    </div>

                    <div className="absolute inset-0 backface-hidden rounded-lg shadow-inner pointer-events-none opacity-30"></div>
                  </div>
                </div>

                <div className="mt-4 flex justify-around">
                  <button className="p-2 text-gray-500 hover:text-blue-700 flex flex-col items-center text-xs">
                    <Heart size={20} />
                    <span>Wishlist</span>
                  </button>
                  <button 
                  onClick={shareBook}
                  className="p-2 text-gray-500 hover:text-blue-700 flex flex-col items-center text-xs">
                    <Share2 size={20} />
                    <span>Share</span>
                  </button>
                  <button className="p-2 text-gray-500 hover:text-blue-700 flex flex-col items-center text-xs">
                    <Bookmark size={20} />
                    <span>Save</span>
                  </button>
                </div>
              </div>

            {/* Book Information */}
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">
                    {book?.title}
                  </h1>
                  <p className="text-lg text-gray-600 mb-4">
                    by <span className="font-medium">{book?.authors[0]}</span>
                  </p>
  
                  {/* Ratings */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className="text-gray-300"
                          // className={`${i < Math.floor(book.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    {
                      book?.rating ?
                      <span className="text-sm text-gray-600 ml-1">
                      {book.rating.toFixed(1)} ({Math.floor(Math.random() * 200) + 50} reviews)
                    </span> : null}
                  </div>
  
                  {/* Price and Stock */}
                  <div className="mb-6">
                    <div className="text-2xl font-bold text-blue-900 mb-2">
                      ${book.price.toFixed(2)}
                    </div>
                    <div className="text-sm">
                      {book.stockQuantity > 0 ? (
                        <span className="text-green-600">
                          ✓ In Stock ({book.stockQuantity} available)
                        </span>
                      ) : (
                        <span className="text-red-600">
                          ✗ Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
  
                  {/* Book Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div>
                      <p className="text-gray-500">Publisher</p>
                      <p className="font-medium">{book.publisher}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Publication Date</p>
                      {
                        book?.publicationDate ? 
                        <p className="font-medium">{new Date(book.publicationDate).toLocaleDateString()}</p> 
                        : null
                      }
                    </div>
                    <div>
                      <p className="text-gray-500">ISBN</p>
                      <p className="font-medium">{book?.isbn}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Pages</p>
                      <p className="font-medium">{book?.pageCount}</p>
                    </div>
                  </div>
  
                  {/* Quantity and Add to Cart */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
  
                    <div className="flex items-center border justify-between h-12 border-gray-300 rounded-md">
                      <button
                        onClick={decreaseQuantity}
                        className="px-4 py-2 text-gray-600 h-full rounded-l-md max-sm:w-1/4 hover:text-blue-700 disabled:text-gray-400"
                        disabled={quantity <= 1}
                      >
                        −
                      </button>
                      <span className="px-4 py-2 text-center w-12">{quantity}</span>
                      <button
                        onClick={increaseQuantity}
                        className="px-4 py-2 text-gray-600 h-full rounded-r-md max-sm:w-1/4 hover:text-blue-700 disabled:text-gray-400"
                        disabled={quantity >= book.stockQuantity}
                      >
                        +
                      </button>
                    </div>
  
                    <Button
                      onClick={handleAddToCart}
                      className="flex-1 flex items-center justify-center h-12 sm:max-w-xs max-sm:h-14"
                      disabled={book.stockQuantity === 0}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </Button>
                  </div>
  
                  {/* Genres */}
                  <div className="mb-6">
                    <div className="text-sm text-gray-500 mb-2">Genres</div>
                    <div className="flex flex-wrap gap-2">
                      {book.genre.map((genre, index) => (
                        <Link
                          key={index}
                          to={`/genres/genre=${genre}`}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
                        >
                          {genre}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }

        {/* Tabs Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="flex border-b">
            <button
              className={`px-6 py-3 text-sm font-medium ${activeTab === 'description'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${activeTab === 'details'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${activeTab === 'reviews'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="mb-4">{book?.description}</p>
              </div>
            )}

            {activeTab === 'details' && (
              <div>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 font-medium text-gray-500 w-1/3">Title</td>
                      <td className="py-2">{book?.title}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium text-gray-500">Author</td>
                      <td className="py-2">{book?.authors[0]}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium text-gray-500">ISBN</td>
                      <td className="py-2">{book?.isbn}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium text-gray-500">Publisher</td>
                      <td className="py-2">{book?.publisher}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium text-gray-500">Publication Date</td>
                      <td className="py-2">{new Date(book?.publicationDate ?? '1990-03-10').toLocaleDateString()}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium text-gray-500">Pages</td>
                      <td className="py-2">{book?.pageCount}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium text-gray-500">Genres</td>
                      <td className="py-2">{book?.genre.join(', ')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Customer Reviews</h3>
                  <Button variant="outline" size="sm">Write a Review</Button>
                </div>

                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Be the first to write a review for this book!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <section className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-blue-900">
                You May Also Like
              </h2>
              <Link to="/books" className="text-blue-700 hover:text-blue-900 text-sm font-medium">
                View More →
              </Link>
            </div>

            <BookGrid books={relatedBooks} />
          </section>
        )}
      </div>
    </Layout>
  );
};

export default BookDetailPage;