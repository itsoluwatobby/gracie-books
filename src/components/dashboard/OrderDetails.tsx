import Button from "../ui/Button";

type OrderDetailsProps = {
  order: Order;
  users: User[];
  formatCurrency: (val: number) => string;
  setSelectedOrder: React.Dispatch<React.SetStateAction<Order | null>>;
}

export default function OrderDetails(
  { 
    order, users,
    formatCurrency, setSelectedOrder,
  }: OrderDetailsProps
) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Order #{order.id}</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setSelectedOrder(null)}
        >
          Close
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <div className="text-xs text-gray-500">Customer</div>
          <div className="font-medium">
            {users.find(u => u.id === order.userId)?.name || 'Unknown'}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Date</div>
          <div className="font-medium">
            {new Date(order.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Status</div>
          <div>
            <select 
              className="border border-gray-300 rounded px-2 py-1 text-sm"
              defaultValue={order.status}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4 mt-4">
        <h4 className="font-medium mb-3">Items</h4>
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <div>
                <div className="font-medium">{item.title}</div>
                <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
              </div>
              <div className="font-medium">
                {formatCurrency(item.priceAtPurchase * item.quantity)}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t pt-4 mt-4">
        <h4 className="font-medium mb-3">Shipping Address</h4>
        <div className="text-sm">
          <p>{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.street}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
          </p>
          <p>{order.shippingAddress.country}</p>
        </div>
      </div>
      
      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between">
          <div className="font-semibold">Total</div>
          <div className="font-semibold">{formatCurrency(order.totalAmount)}</div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button>Update Order</Button>
      </div>
    </div>
  )
}