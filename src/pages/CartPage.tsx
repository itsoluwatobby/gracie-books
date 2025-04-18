import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ChevronLeft, X } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [error, setError] = useState('');

  const handleApplyCoupon = () => {
    if (!couponCode) {
      setError('Please enter a coupon code');
      return;
    }
    
    // For demo purposes, let's say "BOOKS10" is a valid coupon code
    if (couponCode.toUpperCase() === 'BOOKS10') {
      setCouponApplied(true);
      setError('');
    } else {
      setError('Invalid coupon code');
      setCouponApplied(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setCouponCode('');
    setError('');
  };

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=checkout');
    }
  };

  // Calculate order summary
  const subtotal = totalPrice;
  const discount = couponApplied ? subtotal * 0.1 : 0; // 10% discount
  const shipping = subtotal > 100 ? 0 : 5.99;
  const tax = (subtotal - discount) * 0.07; // 7% tax
  const total = subtotal - discount + shipping + tax;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">Your Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
            <div className="flex justify-center mb-4">
              <ShoppingBag size={64} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any books to your cart yet.
            </p>
            <Link to="/books">
              <Button>Browse Books</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-grow">
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">
                      Cart Items ({totalItems})
                    </h2>
                    <button 
                      onClick={clearCart}
                      className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center"
                    >
                      <Trash2 size={16} className="mr-1" />
                      Clear Cart
                    </button>
                  </div>

                  <div className="divide-y">
                    {items.map((item) => (
                      <div key={item.book.id} className="py-4 flex">
                        <div className="w-20 h-28 bg-gray-100 rounded overflow-hidden mr-4">
                          <img 
                            src={item.book.coverImage} 
                            alt={item.book.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <Link to={`/books/${item.book.id}`} className="font-medium hover:text-blue-700">
                              {item.book.title}
                            </Link>
                            <button 
                              onClick={() => removeFromCart(item.book.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <X size={18} />
                            </button>
                          </div>
                          
                          <p className="text-sm text-gray-500">
                            By {item.book.author}
                          </p>
                          
                          <div className="mt-2 flex justify-between items-end">
                            <div className="flex items-center border border-gray-300 rounded">
                              <button
                                onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                                className="px-2 py-1 text-gray-600 hover:text-blue-700"
                                disabled={item.quantity <= 1}
                              >
                                −
                              </button>
                              <span className="px-2 py-1 text-center w-8">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                                className="px-2 py-1 text-gray-600 hover:text-blue-700"
                                disabled={item.quantity >= item.book.stockQuantity}
                              >
                                +
                              </button>
                            </div>
                            
                            <div className="font-semibold">
                              ${(item.book.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <Link to="/books" className="text-blue-700 hover:text-blue-900 inline-flex items-center">
                  <ChevronLeft size={16} className="mr-1" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-80">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {couponApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount (10%)</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (7%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t pt-3 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="mb-6">
                  <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-2">
                    Apply Coupon Code
                  </label>
                  {couponApplied ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded p-2">
                      <div className="flex items-center">
                        <span className="font-medium text-green-700 text-sm">BOOKS10 applied (10% off)</span>
                      </div>
                      <button 
                        onClick={handleRemoveCoupon}
                        className="text-green-700 hover:text-green-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex">
                        <input
                          type="text"
                          id="coupon"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon code"
                          className="block w-full border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          className="bg-blue-800 text-white px-4 rounded-r hover:bg-blue-700 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                      <p className="text-xs text-gray-500 mt-1">Try "BOOKS10" for 10% off</p>
                    </div>
                  )}
                </div>

                <Button 
                  fullWidth 
                  onClick={handleCheckout}
                  disabled={items.length === 0}
                >
                  Proceed to Checkout
                </Button>

                <div className="mt-4 text-xs text-gray-500 text-center">
                  Secure checkout provided by Stripe
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;