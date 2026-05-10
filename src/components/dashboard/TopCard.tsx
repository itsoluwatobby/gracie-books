import { AlertCircle, Clock, ShoppingBag } from "lucide-react";
import Card from "../ui/Card";
import { CURRENCY } from "../../utils/constants";

type TopCardProps = {
  totalOrders: number;
  totalRevenue: number;
  lowStockBooks: number;
  pendingOrders: number;
  formatCurrency: (val: number) => string;
}

export default function TopCard(
  {
    totalOrders, totalRevenue, formatCurrency,
    lowStockBooks, pendingOrders,
  }: TopCardProps) {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card className="p-6 border-t-4 border-t-blue-500">
        <div className="flex items-center">
          <div className="bg-blue-100 p-3 rounded-lg mr-4 flex-shrink-0">
            <ShoppingBag className="h-6 w-6 text-blue-700" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-500 truncate">Total Orders</div>
            <div className="text-2xl font-bold text-gray-900">{totalOrders}</div>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-t-4 border-t-green-500">
        <div className="flex items-center">
          <div className="bg-green-100 p-3 rounded-lg mr-4 flex-shrink-0">
            <span className="h-6 w-6 text-green-700 font-bold text-lg flex items-center justify-center">{CURRENCY.NAIRA}</span>
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-500 truncate">Total Revenue</div>
            <div className="text-2xl font-bold text-gray-900 truncate">{formatCurrency(totalRevenue)}</div>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-t-4 border-t-yellow-500">
        <div className="flex items-center">
          <div className="bg-yellow-100 p-3 rounded-lg mr-4 flex-shrink-0">
            <Clock className="h-6 w-6 text-yellow-700" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-500 truncate">Pending Orders</div>
            <div className="text-2xl font-bold text-gray-900">{pendingOrders}</div>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-t-4 border-t-red-500">
        <div className="flex items-center">
          <div className="bg-red-100 p-3 rounded-lg mr-4 flex-shrink-0">
            <AlertCircle className="h-6 w-6 text-red-700" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-500 truncate">Low Stock</div>
            <div className="text-2xl font-bold text-gray-900">{lowStockBooks}</div>
          </div>
        </div>
      </Card>
    </div>
  )
}