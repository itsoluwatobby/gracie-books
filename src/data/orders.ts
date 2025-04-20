// Mock data for orders
export const orders: Order[] = [
  {
    id: "order-1",
    userId: "user-1",
    items: [
      {
        bookId: "1",
        title: "The Midnight Library",
        quantity: 1,
        priceAtPurchase: 24.99
      },
      {
        bookId: "3",
        title: "Educated",
        quantity: 1,
        priceAtPurchase: 22.99
      }
    ],
    status: "shipped",
    totalAmount: 47.98,
    createdAt: "2023-06-15T10:30:00Z",
    updatedAt: "2023-06-16T08:15:00Z",
    shippingAddress: {
      fullName: "John Doe",
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      country: "USA"
    }
  },
  {
    id: "order-2",
    userId: "user-1",
    items: [
      {
        bookId: "2",
        title: "Atomic Habits",
        quantity: 1,
        priceAtPurchase: 19.99
      }
    ],
    status: "delivered",
    totalAmount: 19.99,
    createdAt: "2023-05-20T14:45:00Z",
    updatedAt: "2023-05-22T16:30:00Z",
    shippingAddress: {
      fullName: "John Doe",
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      country: "USA"
    }
  },
  {
    id: "order-3",
    userId: "user-2",
    items: [
      {
        bookId: "4",
        title: "Project Hail Mary",
        quantity: 1,
        priceAtPurchase: 28.99
      },
      {
        bookId: "7",
        title: "Dune",
        quantity: 1,
        priceAtPurchase: 21.99
      }
    ],
    status: "processing",
    totalAmount: 50.98,
    createdAt: "2023-06-18T09:20:00Z",
    updatedAt: "2023-06-18T12:45:00Z",
    shippingAddress: {
      fullName: "Jane Smith",
      street: "456 Oak Ave",
      city: "Another City",
      state: "NY",
      zipCode: "67890",
      country: "USA"
    }
  }
];

export const getOrdersByUserId = (userId: string): Order[] => {
  return orders.filter(order => order.userId === userId);
};

export const getOrderById = (id: string): Order | undefined => {
  return orders.find(order => order.id === id);
};

export const updateOrderStatus = (orderId: string, status: OrderStatus): Order | undefined => {
  const orderIndex = orders.findIndex(order => order.id === orderId);
  if (orderIndex === -1) return undefined;
  
  orders[orderIndex] = {
    ...orders[orderIndex],
    status,
    updatedAt: new Date().toISOString()
  };
  
  return orders[orderIndex];
};