/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../ui/Button"
import Card from "../ui/Card"

type RecentOrdersProps = {
  orders: Order[];
  formatCurrency: (val: number) => string;
  setActiveSection: React.Dispatch<React.SetStateAction<string>>;
}

export default function RecentOrders(
  { 
    formatCurrency, orders, setActiveSection,
  }: RecentOrdersProps) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Recent Orders</h3>
      <div className="space-y-4">
        {orders.slice(0, 3).map(order => (
          <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium">Order #{order.id}</div>
              <div className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="font-medium text-right">{formatCurrency(order.totalAmount)}</div>
              <div className={`text-xs px-2 py-1 rounded-full text-right ${
                order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveSection('orders')}
        >
          View All Orders
        </Button>
      </div>
    </Card>
  )
}