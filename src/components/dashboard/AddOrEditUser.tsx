/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import Button from "../ui/Button"
import Input from "../ui/Input"
import toast from "react-hot-toast";
import { userService } from "../../services";
import { nanoid } from "nanoid";
import { X } from "lucide-react";


type AddOrEditUserProps = {
  user: UserInfo | null;
  setShowAddUserModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditUser: React.Dispatch<React.SetStateAction<UserInfo | null>>;
}

export const AddOrEditUser: React.FC<AddOrEditUserProps> = (
  { user, setShowAddUserModal, setEditUser },
) => {
  const [userDetails, setUserDetails] = useState<Partial<UserInfo>>({});

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value } as Partial<UserInfo>));
  };

  useEffect(() => {
    if (user) {
      setUserDetails(
        {
          fullName: user.fullName ?? "",
          phoneNumber: user.phoneNumber ?? "",
          profilePicture: user.profilePicture ?? "",
          role: user.role,
          email: user.email,
          shippingAddress: user.shippingAddress,
        }
      );
    }
  }, [user])

  const handleAddUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      if (user) {
        await userService.updateUser(user.id, {...userDetails});
      } else {
        await userService.addUser(
          {
            ...userDetails,
            id: nanoid(28),
            deviceId: "",
            accessToken: "",
            refreshToken: "",
            provider: "unknown",
          }
        );
      }
      toast.success("Record successfully added");
      setEditUser(null);
      setUserDetails({});
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const closeUserModal = () => {
    setEditUser(null);
    setShowAddUserModal(false);
    setUserDetails({})
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold">Add New User</h3>
          <button
            onClick={closeUserModal}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleAddUser} className="p-6">
          <div className="space-y-4">
            <Input
              label="Full Name"
              name="fullName"
              value={userDetails.fullName!}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={userDetails.email}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <Input
              label="Phone Number"
              type="numeric"
              name="phoneNumber"
              value={userDetails.phoneNumber!}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAdmin"
                name="isAdmin"
                checked={userDetails.isAdmin}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor="isAdmin" className="text-sm font-medium text-gray-700">
                Administrator privileges
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={closeUserModal}
            >
              Cancel
            </Button>
            <Button type="submit">
              Add User
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}