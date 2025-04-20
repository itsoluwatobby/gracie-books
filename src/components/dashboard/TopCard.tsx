import { AlertCircle, ShoppingBag } from "lucide-react";
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
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <ShoppingBag className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Total Orders</div>
              <div className="text-2xl font-bold">{totalOrders}</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <span className="h-6 w-6 text-green-700 font-bold text-lg flex items-center justify-center">{CURRENCY.NAIRA}</span>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Total Revenue</div>
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg mr-4">
              <ShoppingBag className="h-6 w-6 text-yellow-700" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Pending Orders</div>
              <div className="text-2xl font-bold">{pendingOrders}</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg mr-4">
              <AlertCircle className="h-6 w-6 text-red-700" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Low Stock</div>
              <div className="text-2xl font-bold">{lowStockBooks}</div>
            </div>
          </div>
        </Card>
      </div>
  )
}