/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { User, MapPin, CreditCard as Edit2, Save, X } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import useAuthContext from '../context/useAuthContext';
import { helper } from '../utils/helper';
import toast from 'react-hot-toast';
import { userService } from '../services';
import { PageRoutes } from '../utils/pageRoutes';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<UserInfo>>({});

  useEffect(() => {
    if (user) {
      setFormData(
        {
          fullName: user.fullName ?? "",
          phoneNumber: user.phoneNumber ?? "",
          profilePicture: user.profilePicture ?? "",
          role: user.role!,
          email: user.email,
          shippingAddress: {
            fullName: user.shippingAddress?.fullName ?? "",
            phoneNumber: user.shippingAddress?.phoneNumber ?? "",
            address: user.shippingAddress?.address ?? "",
            city: user.shippingAddress?.city ?? "",
            state: user.shippingAddress?.state ?? "",
            country: user.shippingAddress?.country ?? "",
          } as ShippingAddress,
        }
      );
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value } as UserInfo));
  };

  const handleShippingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = name as keyof ShippingAddress;
    setFormData(prev => ({
      ...prev,
      shippingAddress: {
        ...(prev?.shippingAddress ?? {}),
        [key]: value,
      } as ShippingAddress,
    } as UserInfo));
  };

  const handleSave = async () => {
    if (isLoading || !user) return;
    
    try {
      setIsLoading(true);
      const data = await userService.updateUser(user.id!, { ...formData });
  
      toast.success("Profile updated!");
      setIsEditing(false);
      setFormData(data as UserInfo);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({});
    setIsEditing(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-900">My Account</h1>
            {!isEditing ? (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="flex items-center"
              >
                <Edit2 size={16} className="mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex items-center"
                >
                  <X size={16} className="mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex items-center"
                >
                  <Save size={16} className="mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold mb-6 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-700" />
                  Profile Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName ?? ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    fullWidth
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email ?? ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    fullWidth
                  />
                  <Input
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber ?? ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="08100001234"
                    fullWidth
                  />
                  <div></div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-6 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-700" />
                  Address Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.shippingAddress?.phoneNumber ?? ""}
                    onChange={handleShippingInputChange}
                    disabled={!isEditing}
                    placeholder="08100001234"
                    fullWidth
                  />
                  <Input
                    label="Street Address"
                    name="address"
                    value={formData.shippingAddress?.address ?? ""}
                    onChange={handleShippingInputChange}
                    disabled={!isEditing}
                    className="md:col-span-2"
                    fullWidth
                  />
                  <Input
                    label="City"
                    name="city"
                    value={formData.shippingAddress?.city ?? ""}
                    onChange={handleShippingInputChange}
                    disabled={!isEditing}
                    fullWidth
                  />
                  <Input
                    label="State/Province"
                    name="state"
                    value={formData.shippingAddress?.state ?? ""}
                    onChange={handleShippingInputChange}
                    disabled={!isEditing}
                    fullWidth
                  />
                  <Input
                    label="Country"
                    name="country"
                    value={formData.shippingAddress?.country ?? ""}
                    onChange={handleShippingInputChange}
                    disabled={!isEditing}
                    fullWidth
                  />
                </div>
              </div>
            </div>

            {/* Account Summary */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Account Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Type</span>
                    <span className="font-medium">
                      {user?.isAdmin ? 'Administrator' : 'Customer'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-medium">{helper.formatTime(user?.createdAt as string, false, "medium")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Orders</span>
                    <span className="font-medium">12</span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span className="text-gray-600">Total Spent</span>
                    <span className="font-medium">{helper.formatPrice(324.50)}</span>
                  </div> */}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Button 
                  onClick={() => navigate(PageRoutes.orders)}
                  variant="outline" fullWidth>
                    View Order History
                  </Button>
                  <Button variant="outline" fullWidth>
                    Manage Wishlist
                  </Button>
                  <Button variant="outline" fullWidth>
                    Change Password
                  </Button>
                  <Button variant="outline" fullWidth>
                    Download Data
                  </Button>
                </div>
              </div>

              <div className="hidden bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Preferences</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email Notifications</span>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SMS Notifications</span>
                    <input type="checkbox" className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Marketing Emails</span>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default ProfilePage;
