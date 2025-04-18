import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import Layout from '../components/layout/Layout';
import OrderItem from '../components/orders/OrderItem';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { getOrdersByUserId } from '../data/orders';

const OrdersPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  // Get orders for the current user
  const orders = user ? getOrdersByUserId(user.id) : [];
  
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">You need to be logged in to view your orders</h2>
            <p className="text-gray-600 mb-6">
              Please log in to access your order history.
            </p>
            <Link to="/login?redirect=orders">
              <Button>Login to Your Account</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <ShoppingBag size={64} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No orders found</h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet.
            </p>
            <Link to="/books">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div>
            <div className="mb-6 text-gray-600">
              Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
            </div>
            
            <div className="space-y-6">
              {orders.map(order => (
                <OrderItem key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrdersPage;