import React from 'react';
import { Link } from 'react-router-dom';
import { Package, CheckCircle, Clock, Truck } from 'lucide-react';
import { Order } from '../../types';

interface OrderItemProps {
  order: Order;
}

const OrderItem: React.FC<OrderItemProps> = ({ order }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <div>
          <div className="text-xs text-gray-500 mb-1">Order ID</div>
          <div className="font-medium">#{order.id}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Order Date</div>
          <div className="font-medium">{formatDate(order.createdAt)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Total Amount</div>
          <div className="font-medium">${order.totalAmount.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Status</div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(order.status)}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="font-medium mb-3">Items ({order.items.length})</h3>
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-gray-100 w-12 h-16 flex items-center justify-center rounded mr-4">
                  <Package className="text-gray-500" />
                </div>
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                </div>
              </div>
              <div className="font-medium">
                ${(item.priceAtPurchase * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 text-right">
        <Link 
          to={`/orders/${order.id}`} 
          className="text-blue-800 hover:text-blue-600 font-medium"
        >
          View Order Details
        </Link>
      </div>
    </div>
  );
};

export default OrderItem;