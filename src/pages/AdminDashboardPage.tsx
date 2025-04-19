import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ShoppingBag, BookOpen, Users, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import useAuthContext from '../context/useAuthContext';
import { orders } from '../data/orders';
import { books } from '../data/books';
import { users } from '../data/users';

const AdminDashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthContext();
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  // Check if user is authenticated and is admin
  if (!isAuthenticated || !user?.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // Calculate summary metrics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending' || order.status === 'processing').length;
  const lowStockBooks = books.filter(book => book.stockQuantity < 5).length;

  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const renderOrderDetails = (order: Order) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Order #{order.id}</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedOrder(null)}
          >
            Close
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <div className="text-xs text-gray-500">Customer</div>
            <div className="font-medium">
              {users.find(u => u.id === order.userId)?.name || 'Unknown'}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Date</div>
            <div className="font-medium">
              {new Date(order.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Status</div>
            <div>
              <select 
                className="border border-gray-300 rounded px-2 py-1 text-sm"
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
        </div>
        
        <div className="border-t pt-4 mt-4">
          <h4 className="font-medium mb-3">Items</h4>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <div>
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                </div>
                <div className="font-medium">
                  {formatCurrency(item.priceAtPurchase * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t pt-4 mt-4">
          <h4 className="font-medium mb-3">Shipping Address</h4>
          <div className="text-sm">
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>
        
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between">
            <div className="font-semibold">Total</div>
            <div className="font-semibold">{formatCurrency(order.totalAmount)}</div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button>Update Order</Button>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Admin Dashboard</h1>
          
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center text-blue-900 hover:text-blue-700"
            >
              Menu {isOpen ? <ChevronUp className="ml-1" /> : <ChevronDown className="ml-1" />}
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className={`${isOpen ? 'block' : 'hidden'} md:block md:w-64`}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <nav className="divide-y">
                <button 
                  className={`px-4 py-3 w-full text-left font-medium flex items-center ${
                    activeSection === 'overview' ? 'bg-blue-50 text-blue-800' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveSection('overview')}
                >
                  <ShoppingBag className={`mr-2 h-5 w-5 ${activeSection === 'overview' ? 'text-blue-800' : 'text-gray-500'}`} />
                  Overview
                </button>
                <button 
                  className={`px-4 py-3 w-full text-left font-medium flex items-center ${
                    activeSection === 'orders' ? 'bg-blue-50 text-blue-800' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveSection('orders')}
                >
                  <ShoppingBag className={`mr-2 h-5 w-5 ${activeSection === 'orders' ? 'text-blue-800' : 'text-gray-500'}`} />
                  Orders
                </button>
                <button 
                  className={`px-4 py-3 w-full text-left font-medium flex items-center ${
                    activeSection === 'books' ? 'bg-blue-50 text-blue-800' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveSection('books')}
                >
                  <BookOpen className={`mr-2 h-5 w-5 ${activeSection === 'books' ? 'text-blue-800' : 'text-gray-500'}`} />
                  Books
                </button>
                <button 
                  className={`px-4 py-3 w-full text-left font-medium flex items-center ${
                    activeSection === 'users' ? 'bg-blue-50 text-blue-800' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveSection('users')}
                >
                  <Users className={`mr-2 h-5 w-5 ${activeSection === 'users' ? 'text-blue-800' : 'text-gray-500'}`} />
                  Users
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            {selectedOrder ? (
              renderOrderDetails(selectedOrder)
            ) : (
              <>
                {activeSection === 'overview' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                      <Card className="p-6">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-3 rounded-lg mr-4">
                            <ShoppingBag className="h-6 w-6 text-blue-700" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-500">Total Orders</div>
                            <div className="text-2xl font-bold">{totalOrders}</div>
                          </div>
                        </div>
                      </Card>
                      
                      <Card className="p-6">
                        <div className="flex items-center">
                          <div className="bg-green-100 p-3 rounded-lg mr-4">
                            <span className="h-6 w-6 text-green-700 font-bold text-lg flex items-center justify-center">$</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-500">Total Revenue</div>
                            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                          </div>
                        </div>
                      </Card>
                      
                      <Card className="p-6">
                        <div className="flex items-center">
                          <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                            <ShoppingBag className="h-6 w-6 text-yellow-700" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-500">Pending Orders</div>
                            <div className="text-2xl font-bold">{pendingOrders}</div>
                          </div>
                        </div>
                      </Card>
                      
                      <Card className="p-6">
                        <div className="flex items-center">
                          <div className="bg-red-100 p-3 rounded-lg mr-4">
                            <AlertCircle className="h-6 w-6 text-red-700" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-500">Low Stock</div>
                            <div className="text-2xl font-bold">{lowStockBooks}</div>
                          </div>
                        </div>
                      </Card>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="p-6">
                        <h3 className="font-semibold mb-4">Recent Orders</h3>
                        <div className="space-y-4">
                          {orders.slice(0, 3).map(order => (
                            <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <div>
                                <div className="font-medium">Order #{order.id}</div>
                                <div className="text-sm text-gray-500">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                              <div>
                                <div className="font-medium text-right">{formatCurrency(order.totalAmount)}</div>
                                <div className={`text-xs px-2 py-1 rounded-full text-right ${
                                  order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 text-center">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => setActiveSection('orders')}
                          >
                            View All Orders
                          </Button>
                        </div>
                      </Card>
                      
                      <Card className="p-6">
                        <h3 className="font-semibold mb-4">Low Stock Books</h3>
                        <div className="space-y-4">
                          {books
                            .filter(book => book.stockQuantity < 5)
                            .slice(0, 3)
                            .map(book => (
                              <div key={book.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                  <div className="w-10 h-14 bg-gray-200 rounded overflow-hidden mr-3">
                                    <img 
                                      src={book.coverImage} 
                                      alt={book.title} 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <div className="font-medium line-clamp-1">{book.title}</div>
                                    <div className="text-sm text-gray-500">{book.author}</div>
                                  </div>
                                </div>
                                <div className={`text-sm font-medium ${
                                  book.stockQuantity === 0 ? 'text-red-600' : 'text-orange-600'
                                }`}>
                                  {book.stockQuantity} in stock
                                </div>
                              </div>
                            ))}
                        </div>
                        <div className="mt-4 text-center">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => setActiveSection('books')}
                          >
                            View All Books
                          </Button>
                        </div>
                      </Card>
                    </div>
                  </div>
                )}

                {activeSection === 'orders' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Manage Orders</h2>
                      <Button>Export Orders</Button>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Order ID
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Customer
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                              </th>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map(order => (
                              <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  #{order.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {users.find(u => u.id === order.userId)?.name || 'Unknown'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 
                                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatCurrency(order.totalAmount)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                  <Button 
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedOrder(order)}
                                  >
                                    View
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'books' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Manage Books</h2>
                      <Button>Add New Book</Button>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Book
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Author
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stock
                              </th>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {books.map(book => (
                              <tr key={book.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="h-10 w-8 flex-shrink-0 mr-3">
                                      <img 
                                        className="h-10 w-8 object-cover" 
                                        src={book.coverImage} 
                                        alt={book.title} 
                                      />
                                    </div>
                                    <div className="text-sm font-medium text-gray-900 line-clamp-1 max-w-xs">
                                      {book.title}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {book.author}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  ${book.price.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`${
                                    book.stockQuantity === 0 ? 'text-red-600' : 
                                    book.stockQuantity < 5 ? 'text-yellow-600' :
                                    'text-green-600'
                                  }`}>
                                    {book.stockQuantity}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                  <Button variant="ghost" size="sm">Edit</Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'users' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Manage Users</h2>
                      <Button>Add New User</Button>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                              </th>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {users.map(user => (
                              <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.name}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {user.isAdmin ? 'Admin' : 'Customer'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                  <Button variant="ghost" size="sm">Edit</Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboardPage;