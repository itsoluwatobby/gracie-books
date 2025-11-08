import { BookOpen, Package, Shield, Truck } from "lucide-react"


const HowWeWork: React.FC = () => {

  return (
    <section className="mb-12">
      <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-8 text-center">How We Work</h2>
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-start">
            <div className="bg-blue-100 p-3 rounded-lg mr-4 flex-shrink-0">
              <Truck size={24} className="text-blue-700" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Delivery & Pickup 🚚📦</h3>
              <p className="text-gray-600">
                Choose between convenient home delivery or pickup from our location. 
                We offer flexible options to suit your schedule and preferences.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-green-100 p-3 rounded-lg mr-4 flex-shrink-0">
              <Shield size={24} className="text-green-700" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Payment Validates Order ‼️</h3>
              <p className="text-gray-600">
                Your order is confirmed only after payment is received. This ensures 
                availability and helps us maintain accurate inventory.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-orange-100 p-3 rounded-lg mr-4 flex-shrink-0">
              <Package size={24} className="text-orange-700" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">4-Week Stockpile</h3>
              <p className="text-gray-600">
                We maintain a rolling inventory with fresh arrivals every week. 
                Books are held for up to 4 weeks before being rotated.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-red-100 p-3 rounded-lg mr-4 flex-shrink-0">
              <BookOpen size={24} className="text-red-700" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Quality Assurance</h3>
              <p className="text-gray-600">
                Each book undergoes careful inspection for condition, completeness, 
                and readability before being added to our collection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default HowWeWork;
