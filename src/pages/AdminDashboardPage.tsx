/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Menu } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { ModalSelections, OrderStatusEnum } from '../utils/constants';
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
import { orderService } from '../services/order.service';
import { bookServices } from '../services';
import { initAppState, InitReloads } from '../utils/initVariables';


const AdminDashboardPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ModalSelectionsType>(ModalSelections.overview);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [books, setBooks] = useState<Book[]>([]);
  const [appState, setAppState] = useState<AppState>(initAppState);
  const [reload, setReload] = useState<Reloads>(InitReloads)


  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!isMounted) return;
      try {
        setAppState((prev) => ({ ...prev, isLoading: true }));
        const inventory = await bookServices.getBooks();
        setBooks(inventory);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setAppState((prev) => ({ ...prev, isError: true, errMsg: err.message }));
      } finally {
        setAppState((prev) => ({ ...prev, isLoading: false }));
      }
    })();

    return () => {
      isMounted = false;
    }
  }, [reload.bookUpdate_reload])

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!isMounted) return;

      try {
        setIsLoading(true);
        const orderItems = await orderService.getAllOrders();
        if (orderItems?.length) setOrders(orderItems);
        else throw Error("An error occurred");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false
    }
  }, [reload.platform_reload]);

  // Calculate summary metrics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter(order => [OrderStatusEnum.pending, OrderStatusEnum.processing].includes(order.status)).length;
  const lowStockBooks = books.filter(book => book.stockQuantity < 2).length;

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentOrders 
            orders={orders}
            formatCurrency={helper.formatPrice}
            setActiveSection={setActiveSection}
            setSelectedOrder={setSelectedOrder}
          />
          <StockPiled books={[]} setActiveSection={setActiveSection} />
        </div>
      </>
    ),
    orders: (
      <ManageOrders 
        orders={orders}
        setSelectedOrder={setSelectedOrder}
        formatCurrency={helper.formatPrice}
      />
    ),
    books: (
      <ManageBooks 
        handleEditBook={handleEditBook}
        formatCurrency={helper.formatPrice}
        setShowBookModal={setShowBookModal}
        appState={appState}
        books={books}
        setBooks={setBooks}
      />
    ),
    users: <ManageUsers />
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 transition-all duration-300 no-scrollbar">
        <div className="xl:px-16 w-full mx-auto sm:px-10 px-4 py-8">
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

          <div className="flex flex-col md:flex-row gap-6 transition-all duration-300">
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
                  setReload={setReload}
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
                setReload={setReload}
              />
            : null
          }
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboardPage;