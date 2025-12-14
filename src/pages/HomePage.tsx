import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, BookOpen, ShoppingBag } from 'lucide-react';
import Layout from '../components/layout/Layout';
import BookGrid from '../components/books/BookGrid';
import Button from '../components/ui/Button';
import useAuthContext from '../context/useAuthContext';
// import useBooksContext from '../context/useBooksContext';
import { useGetBooks } from '../hooks/useGetBooks';
import BookCardLoading from '../components/Loaders/BookCardLoading';
import WhatWeStandFor from '../components/WhatWeStandFor';
import HowWeWork from '../components/HowWeWork';

const HomePage: React.FC = () => {
  const { appName } = useAuthContext() as AuthContextType;

  const pageSize = 10;
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 10);
  fiveDaysAgo.setHours(0, 0, 0, 0);
  const { booksData: newArrivals, appState } = useGetBooks(
    { createdAt: fiveDaysAgo.toISOString(), pagination: { pageSize } });

  const { booksData: bestsellers, appState: bestSellerAppState } = useGetBooks(
    { pagination: { pageSize }, rating: 3 })
  
  const { booksData: featuredBooks, appState: featuredBooksAppState } = useGetBooks(
    { pagination: { pageSize, orderByField: "title", orderDirection: "asc" } })


  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-blue-900 text-white relative overflow-hidden lg:px-10">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
            alt="Books Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Discover Your Next Favorite Book
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              From bestsellers to hidden gems, find the perfect books for your reading journey.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/books">
                <Button size="lg" className='shadow-xl' >Browse Collection</Button>
              </Link>
              <Link to="/new-releases">
                <Button variant="outline" size="lg"
                className='bg-white'
                >New Releases</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white lg:px-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-blue-900">
            Explore Our Categories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={28} className="text-blue-800" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bestsellers</h3>
              <p className="text-gray-600 mb-4">
                Discover the most popular books that readers can't put down.
              </p>
              <Link to="/bestsellers" className="text-blue-700 font-medium hover:text-blue-900 transition-colors">
                View Bestsellers →
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen size={28} className="text-blue-800" />
              </div>
              <h3 className="text-xl font-semibold mb-2">New Releases</h3>
              <p className="text-gray-600 mb-4">
                Be among the first to read the latest and most anticipated titles.
              </p>
              <Link to="/new-releases" className="text-blue-700 font-medium hover:text-blue-900 transition-colors">
                View New Releases →
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={28} className="text-blue-800" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Special Deals</h3>
              <p className="text-gray-600 mb-4">
                Great books at amazing prices. Limited-time offers you don't want to miss.
              </p>
              {/* <Link to="/deals" className="text-blue-700 font-medium hover:text-blue-900 transition-colors"> */}
              <Link to="/pending" className="text-blue-700 font-medium hover:text-blue-900 transition-colors">
                View Deals →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-16 bg-white lg:px-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900">
              Featured Books
            </h2>
            <Link to="/books" className="text-blue-700 hover:text-blue-900 font-medium">
              View All →
            </Link>
          </div>
          
          {
            featuredBooksAppState?.isLoading ? <BookCardLoading /> : <BookGrid books={featuredBooks?.books} />
          }
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="py-16 bg-gray-50 lg:px-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900">
              Bestsellers
            </h2>
            <Link to="/bestsellers" className="text-blue-700 hover:text-blue-900 font-medium">
              View All →
            </Link>
          </div>
          {
            bestSellerAppState?.isLoading ? <BookCardLoading /> : <BookGrid books={bestsellers?.books} />
          }
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-16 bg-white lg:px-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900">
              New Arrivals
            </h2>
            <Link to="/new-releases" className="text-blue-700 hover:text-blue-900 font-medium">
              View All →
            </Link>
          </div>
          {
            appState?.isLoading ? <BookCardLoading /> : <BookGrid books={newArrivals?.books} />
          }
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-blue-800 text-white lg:px-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Stay Updated with {appName.name}
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest book releases, author interviews, and exclusive deals.
          </p>
          
          <form className="max-w-lg mx-auto flex flex-col sm:flex-row gap-2">
            <input 
              type="email" 
              placeholder="Coming Soon..."
              disabled 
              // placeholder="Your email address" 
              className="flex-grow px-4 py-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <Button type="submit" disabled>
              Subscribe
            </Button>
          </form>
          
          <p className="text-sm text-blue-200 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>

      <div className='my-12 p-8'>
        <WhatWeStandFor />
      </div>
      
      <div className='my-12 p-8'>
        <HowWeWork />
      </div>
    </Layout>
  );
};

export default HomePage;