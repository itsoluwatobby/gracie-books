import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Truck } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import useAuthContext from '../context/useAuthContext';
import useCartContext from '../context/useCartContext';
import { nanoid } from 'nanoid';
import { orderService } from '../services/order.service';
import { CURRENCY } from '../utils/constants';
import { helper } from '../utils/helper';

const CheckoutPage: React.FC = () => {
  const { user } = useAuthContext();
  const { items, totalPrice, clearCart } = useCartContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: '',
    // email: '',
    address: '',
    city: '',
    state: '',
    phoneNumber: '',
    country: '',
  });

  useEffect(() => {
    if (user) {
      if (user.shippingAddress) setFormData(user.shippingAddress);
      else {
        setFormData((prev) => (
          {
            ...prev,
            fullName: user.fullName!,
            phoneNumber: user.phoneNumber!,
          }
        ));
      }
    }
  }, [user])

  // if (!isAuthenticated) {
  //   return <Navigate to="/login?redirect=checkout" replace />;
  // }

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newOrder: Partial<Order> = {
        id: nanoid(),
        userId: user.id!,
        items: items,
        status: "pending",
        totalAmount: helper.roundPrice(totalPrice),
        currency: CURRENCY.NAIRA,
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          state: formData.state,
          city: formData.city,
          phoneNumber: formData.phoneNumber,
          country: formData.country
        },
      };

      // Clear cart and redirect to success page
      await orderService.addOrder(newOrder, user.email!);
      clearCart();
      navigate('/orders');
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate order summary
  const subtotal = totalPrice;
  const shipping = subtotal > 100 ? 0 : 5.99;
  // const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + shipping;

  return (
    <Layout>
      <div className="container mx-auto xl:px-24 px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="flex-grow">
            <form onSubmit={handleSubmit}>
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-8">
                <div className="flex items-center mb-4">
                  <Truck className="h-5 w-5 text-blue-700 mr-2" />
                  <h2 className="text-lg font-semibold">Shipping Information</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 xl:px-8 xl:gap-10">
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  />
                  {/* <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  /> */}
                  <Input
                    type='numeric'
                    label="Phone number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  />
                  <Input
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="md:col-span-2"
                    required
                    fullWidth
                  />
                  <Input
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  />
                  <Input
                    label="State/Province"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  />
                  <Input
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  />
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Order Items</h2>
                <div className="divide-y">
                  {items.map((item) => (
                    <div key={item.book.id} className="py-4 flex items-center">
                      <div className="w-16 h-24 bg-gray-100 rounded overflow-hidden mr-4">
                        <img 
                          src={item.book.icon ? item.book.icon : item.book.coverImage} 
                          alt={item.book.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">{item.book.title}</h3>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <div className="font-medium">
                        {helper.formatPrice(item.book.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:hidden">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${subtotal}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>{shipping === 0 ? 'To Calculated' : `${helper.formatPrice(shipping)}`}</span>
                    </div>
                    
                    {/* <div className="flex justify-between">
                      <span className="text-gray-600">Tax (7%)</span>
                      <span>${tax}</span>
                    </div> */}
                    
                    <div className="border-t pt-3 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{helper.formatPrice(total)}</span>
                    </div>
                  </div>

                  <Button 
                    type="submit"
                    fullWidth
                    isLoading={isLoading}
                  >
                    Place Order
                  </Button>

                  <div className="mt-4 text-xs text-gray-500 text-center">
                    By placing your order, you agree to our{' '}
                    <a href="/terms" className="text-blue-700 hover:text-blue-900">
                      Terms of Service
                    </a>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary - Desktop */}
          <div className="hidden lg:block lg:w-80">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{helper.formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shipping === 0 ? 'To Calculated' : `${helper.formatPrice(shipping)}`}</span>
                </div>
                
                {/* <div className="flex justify-between">
                  <span className="text-gray-600">Tax (7%)</span>
                  <span>${tax}</span>
                </div> */}
                
                <div className="border-t pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{helper.formatPrice(total)}</span>
                </div>
              </div>

              <Button 
                type="submit"
                form="checkout-form"
                fullWidth
                isLoading={isLoading}
              >
                Place Order
              </Button>

              <div className="mt-4 text-xs text-gray-500 text-center">
                By placing your order, you agree to our{' '}
                <a href="/terms" className="text-blue-700 hover:text-blue-900">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;