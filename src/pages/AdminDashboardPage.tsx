import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Menu } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { orders } from '../data/orders';
import { books } from '../data/books';
import { users } from '../data/users';
import { ModalSelections } from '../utils/constants';
import { helper } from '../utils/helper';
import {
  AddorEdit,
  ManageBooks,
  ManageOrders,
  ManageUsers,
  OrderDetails,
  RecentOrders,
  Sidebar,
  StockPiled,
  TopCard,
} from '../components/dashboard';

const AdminDashboardPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ModalSelectionsType>(ModalSelections.overview);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);

  // Calculate summary metrics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending' || order.status === 'processing').length;
  const lowStockBooks = books.filter(book => book.stockQuantity < 5).length;

  const handleEditBook = (book: Book) => {
    setEditBook(book);
    setShowBookModal(true);
  };

  const PageRenders: Record<ModalSelectionsType, JSX.Element> =  {
    overview: (
      <>
        <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
        <TopCard 
          totalOrders={totalOrders}
          totalRevenue={totalRevenue}
          lowStockBooks={lowStockBooks}
          pendingOrders={pendingOrders}
          formatCurrency={helper.formatPrice}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentOrders 
            orders={orders}
            formatCurrency={helper.formatPrice}
            setActiveSection={setActiveSection}
          />
          <StockPiled books={books} setActiveSection={setActiveSection} />
        </div>
      </>
    ),
    orders: (
      <ManageOrders 
        users={users}
        orders={orders}
        setSelectedOrder={setSelectedOrder}
        formatCurrency={helper.formatPrice}
      />
    ),
    books: (
      <ManageBooks 
        books={books}
        handleEditBook={handleEditBook}
        formatCurrency={helper.formatPrice}
        setShowBookModal={setShowBookModal}
      />
    ),
    users: <ManageUsers users={users} />
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 transition-all duration-300">
        <div className="container mx-auto px-4 py-8 lg:px-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 bg-white rounded-xl shadow-sm border border-gray-100 px-8 py-6 sticky top-16 z-10 backdrop-blur-sm">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Manage your bookstore efficiently</p>
            </div>
          
            <div className="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Menu className="w-5 h-5 mr-2" />
                Menu 
                {isOpen ? <ChevronUp className="ml-2 w-4 h-4" /> : <ChevronDown className="ml-2 w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 transition-all duration-300">
            {/* Sidebar */}
            <Sidebar 
              isOpen={isOpen}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {selectedOrder ? (
                <OrderDetails 
                  order={selectedOrder}
                  users={users}
                  formatCurrency={helper.formatPrice}
                  setSelectedOrder={setSelectedOrder}
                />
              ) : (
                <div className="space-y-6">
                  { PageRenders[activeSection] }
                </div>
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
      </div>
    </Layout>
  );
};

export default AdminDashboardPage;