/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileWarning, ShoppingBag } from 'lucide-react';
import Layout from '../components/layout/Layout';
import OrderItem from '../components/orders/OrderItem';
import Button from '../components/ui/Button';
import useAuthContext from '../context/useAuthContext';
import { orderService } from '../services/order.service';
import LoadingContent from '../components/ui/ContentLoading';

const OrdersPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthContext() as AuthContextType;
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState<number>(0);

  // setLoading(true)
  const handleReload = () => setReload((prev) => prev += 1);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    const getItems = async () => {
      try {
        setIsLoading(true);
        const orderItems = await orderService.getOrders(user.id!);
        if (orderItems?.length) setOrders(orderItems);
        else throw Error("An error occurred");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (isMounted) getItems();

    return () => {
      isMounted = false
    }
  }, [user, reload]);
  
  if (!isAuthenticated || error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 xl:max-w-[65vw]">
          <div className="bg-white rounded-lg shadow-md p-8 text-center flex flex-col items-center gap-4">
          {
            !isAuthenticated ?
            <>
              <h2 className="text-xl font-semibold mb-4">You need to be logged in to view your orders</h2>
              <p className="text-gray-600 mb-6">
                Please log in to access your order history.
              </p>
              <Link to="/login?redirect=orders">
                <Button>Login to Your Account</Button>
              </Link>
            </>
            :
            <>
              <FileWarning color='red' size={30} />
              <p className="mb-6 capitalize text-red-400">
                {error}
              </p>
              <Button onClick={handleReload}>Reload page</Button>
            </>
          }
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {
        isLoading ?
          <LoadingContent />
        : (
          <div className="container mx-auto px-4 py-8 xl:max-w-[75vw]">
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
        )
      }
    </Layout>
  );
};

export default OrdersPage;