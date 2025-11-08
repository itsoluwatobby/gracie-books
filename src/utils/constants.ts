
export const CURRENCY = {
  "NAIRA": "₦",
} as const;

export const ModalSelections = {
  books: 'books',
  users: 'users',
  orders: 'orders',
  overview: 'overview',
} as const;

export const UserRole = {
  admin: "1155",
  user: "1140",
} as const;

export const StorageKey = {
  deviceKey: "wandyte-sales::unique_id",
  userKey: "wandyte-sales::user",
  passwordResetKey: "wandyte-sales::reset_password_timestamp",
} as const;

export const StorageModels = {
  users: "users",
  books: "books",
  carts: "carts",
  orders: "orders",
} as const;

export const OrderStatusEnum: Record<OrderStatus, OrderStatus> = {
  pending: "pending",
  processing: "processing",
  shipped: "shipped",
  delivered: "delivered",
  cancelled: "cancelled",
};
