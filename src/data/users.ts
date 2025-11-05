// Mock data for users
export const users: UserInfo[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    isAdmin: false
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    isAdmin: false
  },
  {
    id: "admin-1",
    name: "Admin UserInfo",
    email: "admin@example.com",
    isAdmin: true
  }
];

// Mock user preferences
export const userPreferences: Record<string, UserPreferences> = {
  "user-1": {
    favoriteGenres: ["Science Fiction", "Mystery"],
    wishlist: ["4", "8"]
  },
  "user-2": {
    favoriteGenres: ["Self-Help", "Biography"],
    wishlist: ["2", "3"]
  }
};

export const getUserById = (id: string): UserInfo | undefined => {
  return users.find(user => user.id === id);
};

export const getUserPreferences = (userId: string): UserPreferences | undefined => {
  return userPreferences[userId];
};