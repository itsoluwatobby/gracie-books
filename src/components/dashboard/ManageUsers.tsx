/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import Button from '../ui/Button'
import { orderService, userService } from '../../services';
import { LucideBatteryWarning } from 'lucide-react';
import LoadingContent from '../ui/ContentLoading';
import { AddOrEditUser } from './AddOrEditUser';
import { helper } from '../../utils/helper';
import { OrderStatusEnum } from '../../utils/constants';

// type ManageUsersProps = {
//   users: UserInfo[];
// }

type UserHistory = UserInfo & {
  orders: number,
  pendingOrders: number,
  ordersInProgress: number,
  completedOrders: number,
  totalSpent: number,
}

type OrderAnalytics = {
  totalUsers: number;
  totalOders: number;
  totalPending: number;
  totalProcessed: number;
  totalCompleted: number;
  totalAmount: number;
}

export default function ManageUsers() {
  const [users, setUsers] = useState<UserHistory[]>([]);
  const [analytics, setAnalytics] = useState<OrderAnalytics | null>(null);
  const [editUser, setEditUser] = useState<UserInfo | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState<number>(0);

  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
  
  const handleReload = () => setReload((prev) => prev += 1);
  
  const calculateTotalItems = (items: UserHistory[]) => {
    return items.reduce((acc, init) => {
      acc.totalOders += init.orders;
      acc.totalPending += init.pendingOrders;
      acc.totalProcessed += init.ordersInProgress;
      acc.totalCompleted += init.completedOrders;
    
      acc.totalAmount += init.totalSpent;

      return acc;
    },
    {
      totalOders: 0,
      totalPending: 0,
      totalProcessed: 0,
      totalCompleted: 0,
      totalAmount: 0,
    })
  }

  useEffect(() => {
    if (users.length) {
      const result = calculateTotalItems(users);
      setAnalytics({ totalUsers: users.length, ...result});
    }
  }, [users])

  useEffect(() => {
    let isMounted = true;
    const getUsers = async () => {
      try {
        setIsLoading(true);
        const data = new Map<string, UserHistory>();
        const result = await userService.getUsers();
        result.forEach((user) => data.set(
          user.id,
          {
            ...user,
            completedOrders: 0,
            pendingOrders: 0,
            ordersInProgress: 0,
            orders: 0,
            totalSpent: 0,
          } as UserHistory,
        ));

        const orderItems = await orderService.getAllOrders();
        if (orderItems?.length) {
          const { pending, processing, shipped, delivered } = OrderStatusEnum;
          orderItems.forEach((order) => {
            const item = data.get(order.userId);
            if (item) {
              item.totalSpent += order.totalAmount;
              item.orders += 1;
              item.pendingOrders += order.status === pending ? 1 : 0;
              item.ordersInProgress += [processing, shipped].includes(order.status) ? 1 : 0;
              item.completedOrders += order.status === delivered ? 1 : 0;
            }
          });
        }

        const userHistory = Array.from(data.values());
        if (result?.length) setUsers(userHistory);
        else throw Error("No Records Found");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (isMounted) getUsers();

    return () => {
      isMounted = false
    }
  }, [reload]);

  const handleEdit = (user: UserInfo) => {
    setShowAddUserModal(true);
    setEditUser(user);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Users</h2>
        <Button onClick={() => setShowAddUserModal(true)}>Add New UserInfo</Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {
          isLoading ?
            <LoadingContent />
          : 
          error ? (
            <div className="container flex items-center flex-col mx-auto px-4 py-12">
              <LucideBatteryWarning color='red' size={30} />
              <p className="mb-6 capitalize text-red-400">
                {error}
              </p>
              <Button onClick={handleReload}>Reload</Button>
            </div>
          ) : (
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pending
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Processed
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total spent
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
                        {user?.fullName ?? "Unknown"}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.pendingOrders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.ordersInProgress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.completedOrders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {helper.formatPrice(user.totalSpent)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(user)} 
                      >Edit</Button>
                    </td>
                  </tr>
                ))}

                <tr className="hover:bg-gray-100 bg-gray-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      Total
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {analytics?.totalUsers}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {analytics?.totalOders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {analytics?.totalPending}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {analytics?.totalProcessed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {analytics?.totalCompleted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {helper.formatPrice(analytics?.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          )
        }
        {
          showAddUserModal 
            ? <AddOrEditUser 
                user={editUser}
                setEditUser={setEditUser}
                setShowAddUserModal={setShowAddUserModal}
              />
            : null
        }
      </div>
    </div>
  )
}