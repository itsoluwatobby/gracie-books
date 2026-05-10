import { ModalSelections } from "../../utils/constants";
import Button from "../ui/Button"
import Card from "../ui/Card"

type RecentOrdersProps = {
  orders: Order[];
  formatCurrency: (val: number) => string;
  setActiveSection: React.Dispatch<React.SetStateAction<ModalSelectionsType>>;
  setSelectedOrder: React.Dispatch<React.SetStateAction<Order | null>>;
}

export default function RecentOrders(
  { 
    formatCurrency, orders,
    setActiveSection,
    setSelectedOrder,
  }: RecentOrdersProps) {

  const statusColor: Record<string, string> = {
    delivered: 'bg-green-100 text-green-800',
    shipped: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Recent Orders</h3>
        {orders.length > 0 && (
          <span className="text-xs bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded-full">
            {orders.length} total
          </span>
        )}
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No orders yet</p>
      ) : (
        <div className="space-y-3">
          {orders.slice(0, 8).map(order => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="flex justify-between cursor-pointer items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
            >
              <div className="min-w-0 flex-1 mr-4">
                <div className="font-medium text-sm truncate">
                  Order #{order.id.length > 12 ? `${order.id.slice(0, 12)}…` : order.id}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="font-medium text-sm">{formatCurrency(order.totalAmount)}</div>
                <span className={`inline-block mt-0.5 text-xs px-2 py-0.5 rounded-full ${
                  statusColor[order.status] ?? 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveSection(ModalSelections.orders)}
        >
          View All Orders
        </Button>
      </div>
    </Card>
  )
}