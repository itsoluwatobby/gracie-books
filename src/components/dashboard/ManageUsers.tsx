/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import Button from '../ui/Button'
import { userService } from '../../services';
import { LucideBatteryWarning } from 'lucide-react';
import LoadingContent from '../ui/ContentLoading';

// type ManageUsersProps = {
//   users: UserInfo[];
// }

export default function ManageUsers() {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState<number>(0);
  
    // setLoading(true)
  const handleReload = () => setReload((prev) => prev += 1);

  useEffect(() => {
    let isMounted = true;
    const getUsers = async () => {
      try {
        setIsLoading(true);
        const result = await userService.getUsers();
        if (result?.length) setUsers(result);
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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Users</h2>
        <Button>Add New UserInfo</Button>
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )
        }
      </div>
    </div>
  )
}