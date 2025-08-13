import React from 'react';
import { X, Calendar, User, Package, MapPin, CreditCard } from 'lucide-react';
import Button from "../ui/Button";

type OrderDetailsProps = {
  order: Order;
  users: User[];
  formatCurrency: (val: number) => string;
  setSelectedOrder: React.Dispatch<React.SetStateAction<Order | null>>;
}

export default function OrderDetails(
  { 
    order, users,
    formatCurrency, setSelectedOrder,
  }: OrderDetailsProps
) {
  const customer = users.find(u => u.id === order.userId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-white">Order #{order.id}</h3>
            <p className="text-blue-100 mt-1">Order Details & Management</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedOrder(null)}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
          >
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </div>

      <div className="p-8">
        {/* Order Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center mb-3">
              <User className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">Customer</span>
            </div>
            <div className="text-lg font-bold text-blue-900">
              {customer?.fullName || 'Unknown Customer'}
            </div>
            {customer?.email && (
              <div className="text-sm text-blue-600 mt-1">{customer.email}</div>
            )}
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center mb-3">
              <Calendar className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-800">Order Date</span>
            </div>
            <div className="text-lg font-bold text-green-900">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="text-sm text-green-600 mt-1">
              {new Date(order.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center mb-3">
              <Package className="w-5 h-5 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-purple-800">Status</span>
            </div>
            <select 
              className={`w-full border rounded-lg px-3 py-2 text-sm font-medium capitalize ${getStatusColor(order.status)}`}
              defaultValue={order.status}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="flex items-center mb-6">
            <Package className="w-6 h-6 text-gray-600 mr-3" />
            <h4 className="text-xl font-bold text-gray-900">Order Items</h4>
            <span className="ml-auto bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h5>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="bg-gray-100 px-3 py-1 rounded-full">
                        Qty: {item.quantity}
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        {formatCurrency(item.priceAtPurchase)} each
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(item.priceAtPurchase * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 mb-8 border border-orange-200">
          <div className="flex items-center mb-4">
            <MapPin className="w-6 h-6 text-orange-600 mr-3" />
            <h4 className="text-xl font-bold text-orange-900">Shipping Address</h4>
          </div>
          <div className="bg-white rounded-lg p-5 border border-orange-200">
            <div className="space-y-2 text-gray-700">
              <p className="font-semibold text-lg text-gray-900">{order.shippingAddress.fullName}</p>
              <p className="text-gray-600">{order.shippingAddress.street}</p>
              <p className="text-gray-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p className="text-gray-600 font-medium">{order.shippingAddress.country}</p>
            </div>
          </div>
        </div>

        {/* Order Total */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CreditCard className="w-6 h-6 text-green-100 mr-3" />
              <span className="text-xl font-bold text-white">Order Total</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {formatCurrency(order.totalAmount)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" className="px-6 py-3">
            Print Order
          </Button>
          <Button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
            Update Order
          </Button>
        </div>
      </div>
    </div>
  )
}