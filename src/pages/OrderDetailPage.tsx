import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Package, CheckCircle, ArrowLeft, MapPin, Copy, Check, ExternalLink } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { MetaTags } from '../components/layout/OGgraph';
import Button from '../components/ui/Button';
import useAuthContext from '../context/useAuthContext';
import { GetStatusIcon } from '../components/orders/StatusIcons';
import { getStatusColor, getStatusText, getTrackingSteps } from '../components/order/helper';
import { orderService } from '../services/order.service';
import { helper } from '../utils/helper';
import { INSTAGRAM_DM_URL } from '../utils/constants';
import LoadingContent from '../components/ui/ContentLoading';


const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, app } = useAuthContext();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const buildOrderMessage = () => {
    if (!order) return '';
    const bookList = order.items.map(item => `• ${item.book.title} x${item.quantity} — ${helper.formatPrice(item.book.price * item.quantity)}`).join('\n');
    const { fullName, address, city, state, country, phoneNumber } = order.shippingAddress;
    return `Hi! I just placed an order 🛍️\n\nOrder ID: ${order.id}\n\nItems:\n${bookList}\n\nTotal: ${helper.formatPrice(order.totalAmount)}\n\nShipping to: ${fullName}, ${address}, ${city}, ${state}, ${country}\nPhone: ${phoneNumber}`;
  };

  const handleCopy = () => {
    if (!order) return;
    navigator.clipboard.writeText(buildOrderMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDMRedirect = () => {
    navigator.clipboard.writeText(buildOrderMessage());
    window.open(INSTAGRAM_DM_URL, '_blank');
  };

  useEffect(() => {
    if (id) {
      (async () => {
        setLoading(true)
        const fetchedOrder = await orderService.getOrder(id);
        setOrder(fetchedOrder || null);
        setLoading(false);
      })();
    }
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <LoadingContent />
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Order not found</h2>
            <p className="text-gray-600 mb-6">
              The order you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Link to="/orders">
              <Button>Back to Orders</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Check if user owns this order (or is admin)
  if (order.userId !== user?.id && !user?.isAdmin) {
    return <Navigate to="/orders" replace />;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout>
      <MetaTags title={`Order #${order.id}`} description="View your order details and tracking status." noindex />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link to="/orders" className="text-blue-700 hover:text-blue-900 inline-flex items-center mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Orders
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Order #{order.id}</h1>
                <button onClick={handleCopy} className="text-gray-400 hover:text-blue-600 transition-colors" title="Copy order ID">
                  {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <div className={`mt-4 md:mt-0 px-4 py-2 rounded-lg border ${getStatusColor(order.status)}`}>
              <div className="flex items-center">
                <GetStatusIcon status={order.status} />
                <span className="ml-2 font-medium">{getStatusText(order.status)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Tracking */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-6">Order Tracking</h2>
              <div className="relative">
                {getTrackingSteps(order.status).map((step, index) => (
                // {getTrackingSteps(order.status).map((step, index) => (
                  <div key={step.key} className='flex flex-col'>
                    <div className="flex items-center last:mb-0 first">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-current"></div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className={`font-medium ${step.completed ? 'text-blue-900' : 'text-gray-500'}`}>
                          {step.label}
                        </div>
                        {step.key === order.status && (
                          <div className="text-sm text-gray-500">
                            Updated {formatDate(order.updatedAt)}
                          </div>
                        )}
                      </div>
                    </div>
                  
                    {/* {index < getTrackingSteps(order.status).length - 1 && ( */}
                    {index < getTrackingSteps(order.status).length - 1 && (
                      <div className={`ml-[15px] w-0.5 h-6 my-1 ${
                        step.completed ? 'bg-blue-600' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
              {/* </div> */}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Order Items</h2>
              <div className="divide-y">
                {order.items.map((item, index) => {
                  // const book = getBookById(item.bookId);
                  return (
                    <div key={index} className="py-4 flex items-center">
                      <div className="w-16 h-24 bg-gray-100 rounded overflow-hidden mr-4">
                        {
                          (item.book?.coverImage || item.book?.icon) ? (
                            <img 
                              src={item.book?.icon ? item.book?.icon : item.book.coverImage} 
                              alt={item.book.title} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-8 w-8 text-gray-400" />
                            </div>
                          )
                        }
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">{item.book.title}</h3>

                        <p className="text-sm text-gray-500">by {item.book.authors.join(", ")}</p>

                        <div className="flex items-center mt-1">
                          <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-sm text-gray-500">{helper.formatPrice(item.book.price)} each</span>
                        </div>
                      </div>
                      <div className="font-medium">{helper.formatPrice(item.price)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                {/* <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${(order.totalAmount * 0.93).toFixed(2)}</span>
                </div> */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{order.totalAmount > 100 ? 'Free' : helper.formatPrice(5.99)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{helper.formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-700" />
                Shipping Address
              </h2>
              <div className="text-sm space-y-1">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment Method
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-blue-700" />
                Payment Method
              </h2>
              <div className="text-sm">
                <p className="font-medium">Credit Card</p>
                <p className="text-gray-600">**** **** **** 1234</p>
              </div>
            </div> */}

            {/* Actions */}
            <div className="space-y-3">
              {
                order.status === 'pending' ? (
                <>
                  <button
                    onClick={handleCopy}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy Order Message'}
                  </button>
                  
                  <button
                    onClick={handleDMRedirect}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-pink-600 border border-pink-200 rounded-lg hover:bg-pink-50 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Send Order via Instagram DM
                  </button>
                </>
                )  : null
              }

              {
                order.status === 'delivered' ? (
                  <Button fullWidth variant="outline">
                    Leave a Review
                  </Button>
                ) 
                : null
              }
      
              {
                order.status === 'pending' ? (
                  <Button fullWidth variant="outline">
                    Cancel Order
                  </Button>
                ) 
                : null
              }
        
              <a href={`mailto:${app.email}?subject=Support Request - Order %23${order.id}`}>
                <Button fullWidth variant="outline">
                  Contact Support
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetailPage;