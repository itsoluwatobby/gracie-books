import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react';
import useAuthContext from '../../context/useAuthContext';
import SVGIcon from '../svgs/Index';

const Footer: React.FC = () => {
  const { appName } = useAuthContext();

  return (
    <footer className="bg-blue-900 text-white pt-12 pb-8 w-full">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8" />
              <span className="text-xl font-bold">{appName.name}</span>
            </div>
            <p className="text-blue-200 text-sm mt-2">
              Your destination for discovering your next favorite book.
              Quality literature, competitive prices, and a passion for reading.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-white hover:text-blue-200 transition-colors">
               <SVGIcon type='Facebook' />
              </a>
              <a href="#" className="text-white hover:text-blue-200 transition-colors">
                <SVGIcon type='Twitter' />
              </a>
              <a href="#" className="text-white hover:text-blue-200 transition-colors">
                <SVGIcon type='Instagram' />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className='flex flex-col md:items-center w-fit'>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-blue-200 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/books" className="text-blue-200 hover:text-white transition-colors">Browse Books</Link>
              </li>
              <li>
                <Link to="/new-releases" className="text-blue-200 hover:text-white transition-colors">New Releases</Link>
              </li>
              <li>
                <Link to="/bestsellers" className="text-blue-200 hover:text-white transition-colors">Bestsellers</Link>
              </li>
              <li>
                <Link to="/deals" className="text-blue-200 hover:text-white transition-colors">Special Deals</Link>
              </li>
              <li>
                <Link to="/about" className="text-blue-200 hover:text-white transition-colors">About Us</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className='w-fit'>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/contact" className="text-blue-200 hover:text-white transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link to="/faq" className="text-blue-200 hover:text-white transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/shipping" className="text-blue-200 hover:text-white transition-colors">Shipping & Returns</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-blue-200 hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-blue-200 hover:text-white transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/track-order" className="text-blue-200 hover:text-white transition-colors">Track Your Order</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className=''>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <MapPin className="flex-none h-5 w-5 mr-2 text-blue-200" />
                <span className="text-blue-200">123 Book Street, Reading City, RC 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="flex-none h-5 w-5 mr-2 text-blue-200" />
                <span className="text-blue-200">{appName.name}</span>
              </li>
              <li className="flexitems-center">
                <Mail className="flex-none h-5 w-5 mr-2 text-blue-200" />
                <a href={`mailto:${appName.email}`} className="text-blue-200 whitespace-pre-wrap hover:text-white transition-colors">
                  {appName.email}
                </a>
              </li>
              <li className="pt-2">
                <h4 className="text-sm font-semibold mb-2">Subscribe to our newsletter</h4>
                <form className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="px-3 py-2 text-gray-800 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                  />
                  <button
                    type="submit"
                    className="bg-blue-700 hover:bg-blue-600 text-white px-4 rounded-r-md transition-colors"
                  >
                    Join
                  </button>
                </form>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-200 text-sm">
            &copy; {new Date().getFullYear()} {appName.name}. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="text-blue-200 hover:text-white text-sm transition-colors">Privacy</a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white text-sm transition-colors">Terms</a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white text-sm transition-colors">Sitemap</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;