import { Heart, Recycle, Star, Users } from "lucide-react";


const WhatWeStandFor: React.FC = () => {

  return (
     <section className="mb-12">
      <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-8 text-center">What We Stand For</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Recycle size={32} className="text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
          <p className="text-gray-600">
            Giving books a second life reduces waste and promotes environmental responsibility.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={32} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Affordability</h3>
          <p className="text-gray-600">
            Quality books at prices that make reading accessible to everyone.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star size={32} className="text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Quality</h3>
          <p className="text-gray-600">
            Every book is carefully inspected to ensure you receive excellent condition items.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={32} className="text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Community</h3>
          <p className="text-gray-600">
            Building connections between book lovers and fostering a reading community.
          </p>
        </div>
      </div>
    </section>
  )
}
export default WhatWeStandFor;