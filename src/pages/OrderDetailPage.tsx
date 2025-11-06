import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Package, CheckCircle, ArrowLeft, MapPin } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import useAuthContext from '../context/useAuthContext';
import { GetStatusIcon } from '../components/orders/StatusIcons';
import { getStatusColor, getStatusText, getTrackingSteps } from '../components/order/helper';
import { orderService } from '../services/order.service';
import { helper } from '../utils/helper';
import LoadingContent from '../components/ui/ContentLoading';


const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthContext();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link to="/orders" className="text-blue-700 hover:text-blue-900 inline-flex items-center mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Orders
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Order #{order.id}</h1>
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
                      <div className={`lasthidden ml-4 bsolute left-4 w-0.5 h-5 mt1 ${
                        step.completed ? 'bg-blue-600' : 'bg-gray-200'
                      }`} style={{ top: `${index * 6 + 2}rem` }}></div>
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
                  <span>${(order.totalAmount > 100 ? 0 : 5.99).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${(order.totalAmount * 0.07).toFixed(2)}</span>
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
              {order.status === 'delivered' && (
                <Button fullWidth variant="outline">
                  Leave a Review
                </Button>
              )}
              {['pending', 'processing'].includes(order.status) && (
                <Button fullWidth variant="outline">
                  Cancel Order
                </Button>
              )}
              <Button fullWidth variant="outline">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetailPage;