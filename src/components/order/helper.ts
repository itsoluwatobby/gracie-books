
export const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'Order Pending';
      case 'processing':
        return 'Processing Order';
      case 'shipped':
        return 'Order Shipped';
      case 'delivered':
        return 'Order Delivered';
      case 'cancelled':
        return 'Order Cancelled';
      default:
        return status;
    }
  };

export const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'processing':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'shipped':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'delivered':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getTrackingSteps = (status: OrderStatus) => {
  const steps = [
    { key: 'pending', label: 'Order Placed', completed: true },
    { key: 'processing', label: 'Processing', completed: ['processing', 'shipped', 'delivered'].includes(status) },
    { key: 'shipped', label: 'Shipped', completed: ['shipped', 'delivered'].includes(status) },
    { key: 'delivered', label: 'Delivered', completed: status === 'delivered' }
  ];
  return steps;
};
