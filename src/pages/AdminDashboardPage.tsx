import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Layout from '../components/layout/Layout';
import useAuthContext from '../context/useAuthContext';
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
  const { user, isAuthenticated } = useAuthContext();
  const [activeSection, setActiveSection] = useState<ModalSelectionsType>(ModalSelections.overview);
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between z-10 pt-3 p-1 rounded sticky bg-white top-16 items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Admin Dashboard</h1>
          
          <div className="flex ld:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center text-blue-900 hover:text-blue-700"
            >
              Menu {isOpen ? <ChevronUp className="ml-1" /> : <ChevronDown className="ml-1" />}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-5">
          {/* Sidebar */}
          <Sidebar 
            isOpen={isOpen}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />

          {/* Main Content */}
          <div className="flex-grow">
            {selectedOrder ? (
              <OrderDetails 
                order={selectedOrder}
                users={users}
                formatCurrency={helper.formatPrice}
                setSelectedOrder={setSelectedOrder}
              />
            ) : (
              <>
                { PageRenders[activeSection] }
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