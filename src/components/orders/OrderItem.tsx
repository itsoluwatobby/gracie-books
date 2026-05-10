import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { GetStatusIcon } from './StatusIcons';
import { getStatusColor, getStatusText } from './helpers';
import { helper } from '../../utils/helper';

interface OrderItemProps {
  order: Order;
}

const OrderItem: React.FC<OrderItemProps> = ({ order }) => {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow duration-200">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <div className="text-xs text-gray-500 mb-0.5">Order ID</div>
          <div className="font-medium text-sm truncate max-w-[140px]">#{order.id}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-0.5">Order Date</div>
          <div className="font-medium text-sm">{helper.formatTime(order.createdAt)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-0.5">Total Amount</div>
          <div className="font-medium text-sm">{helper.formatPrice(order.totalAmount)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-0.5">Status</div>
          <div className="flex items-center space-x-2">
            <GetStatusIcon status={order.status} />
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
                <div className="bg-gray-100 w-14 h-12 flex items-center justify-center rounded-sm mr-4">
                  {
                    !failedImages.has(item.book?.id) && (item.book?.coverImage || item.book?.icon) ?
                      <img
                        src={failedImages.has(item.book?.id) ? item.book?.icon : item.book?.coverImage}
                        alt={item.book?.title}
                        onError={() => setFailedImages(prev => new Set(prev).add(item.book?.id))}
                        className="w-full h-full object-cover rounded-sm"
                      />
                    :
                      <Package className="text-gray-500" />
                  }
                </div>
                <div>
                  <h4 className="font-medium">{item.book.title}</h4>
                  <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                </div>
              </div>
              <div className="font-medium">
                {helper.formatPrice(item.price)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Link
          to={`/orders/${order.id}`}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors duration-200"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default OrderItem;