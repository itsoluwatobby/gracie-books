import React, { useState } from 'react';
import { ShoppingBag, BookOpen, Users, ChevronDown, ChevronUp } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import useAuthContext from '../context/useAuthContext';
import { orders } from '../data/orders';
import { books } from '../data/books';
import { users } from '../data/users';
import { CURRENCY } from '../utils/constants';
import { helper } from '../utils/helper';
import TopCard from '../components/dashboard/TopCard';
import RecentOrders from '../components/dashboard/RecentOrders';
import StockPiled from '../components/dashboard/StockPiled';
import ManageBooks from '../components/dashboard/ManageBooks';
import ManageUsers from '../components/dashboard/ManageUsers';
import ManageOrders from '../components/dashboard/ManageOrders';
import AddorEdit from '../components/dashboard/AddorEdit';

const AdminDashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthContext();
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);
  
  // Check if user is authenticated and is admin
  if (!isAuthenticated || !user?.isAdmin) {
    // return <Navigate to="/login" replace />;
  }

  // Calculate summary metrics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending' || order.status === 'processing').length;
  const lowStockBooks = books.filter(book => book.stockQuantity < 5).length;

  // Format currency
  const formatCurrency = (amount: number) => {
    return `${CURRENCY.NAIRA} ${helper.formatPrice(amount)}`;
  };

  const handleEditBook = (book: Book) => {
    setEditBook(book);
    setShowBookModal(true);
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
                    
                   <TopCard 
                    totalOrders={totalOrders}
                    totalRevenue={totalRevenue}
                    lowStockBooks={lowStockBooks}
                    pendingOrders={pendingOrders}
                    formatCurrency={formatCurrency}
                   />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      <RecentOrders 
                        orders={orders}
                        formatCurrency={formatCurrency}
                        setActiveSection={setActiveSection}
                      />
                      
                      <StockPiled books={books} setActiveSection={setActiveSection} />
                    
                    </div>
                  </div>
                )}

                {activeSection === 'orders' ? (
                  <ManageOrders 
                    users={users}
                    orders={orders}
                    setSelectedOrder={setSelectedOrder}
                    formatCurrency={formatCurrency}
                  />
                ) : null}

                {activeSection === 'books' ? (
                  <ManageBooks books={books} handleEditBook={handleEditBook} />
                ) : null}

                {activeSection === 'users' ? (
                  <ManageUsers users={users} />
                ) : null}
              </>
            )}
          </div>
        </div>

        {
          showBookModal ?
            <AddorEdit 
              editBook={editBook}
              setEditBook={setEditBook}
              setShowBookModal={setShowBookModal}
            />
          : null
        }
      </div>
    </Layout>
  );
};

export default AdminDashboardPage;