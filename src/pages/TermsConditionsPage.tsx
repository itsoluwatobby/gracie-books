import React from 'react';
import { AlertTriangle, Shield, Truck, CreditCard, Clock, BookOpen } from 'lucide-react';
import Layout from '../components/layout/Layout';
import useAuthContext from '../context/useAuthContext';

const TermsConditionsPage: React.FC = () => {
  const { appName } = useAuthContext() as AuthContextType;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-blue-900 text-white rounded-lg p-8 mb-8">
            <div className="text-center">
              <Shield size={48} className="mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Terms & Conditions</h1>
              <p className="text-blue-200">{appName.name} - Thrift & Preloved Books</p>
              <p className="text-sm text-blue-300 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
            <div className="flex items-start">
              <AlertTriangle className="text-red-500 mr-3 flex-shrink-0" size={24} />
              <div>
                <h2 className="text-lg font-semibold text-red-800 mb-2">Important Notice</h2>
                <p className="text-red-700">
                  By using {appName.name}' services, you agree to these terms and conditions. 
                  Please read them carefully before making any purchases.
                </p>
              </div>
            </div>
          </div>

          {/* Terms Sections */}
          <div className="space-y-8">
            {/* About Our Service */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <BookOpen className="text-blue-700 mr-3" size={24} />
                <h2 className="text-xl font-semibold text-blue-900">About Our Service</h2>
              </div>
              <div className="prose max-w-none text-gray-700">
                <p className="mb-4">
                  {appName.name} specializes in <strong>thrift & preloved books 🤗</strong>. We are committed to 
                  providing quality second-hand books at affordable prices while promoting sustainability 
                  and environmental responsibility.
                </p>
                <p>
                  All books sold through our platform are pre-owned and have been carefully inspected 
                  for quality and readability. While we strive to accurately describe the condition 
                  of each item, please understand that these are used books and may show normal signs of wear.
                </p>
              </div>
            </section>

            {/* Payment & Order Validation */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <CreditCard className="text-green-700 mr-3" size={24} />
                <h2 className="text-xl font-semibold text-blue-900">Payment & Order Validation</h2>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-800 font-semibold">⚠️ PAYMENT VALIDATES ORDER ‼️</p>
              </div>
              <div className="prose max-w-none text-gray-700">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your order is only confirmed after payment has been successfully processed</li>
                  <li>Items are reserved for a limited time pending payment completion</li>
                  <li>Unpaid orders may be cancelled and items returned to available inventory</li>
                  <li>We accept major credit cards, debit cards, and digital payment methods</li>
                  <li>All prices are final at the time of payment confirmation</li>
                </ul>
              </div>
            </section>

            {/* Delivery & Pickup */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Truck className="text-purple-700 mr-3" size={24} />
                <h2 className="text-xl font-semibold text-blue-900">Delivery & Pickup Options 🚚📦</h2>
              </div>
              <div className="prose max-w-none text-gray-700">
                <h3 className="text-lg font-semibold mb-2">Delivery Service 🚚</h3>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Standard delivery within 3-7 business days</li>
                  <li>Delivery fees apply based on location and order size</li>
                  {/* <li>Free delivery on orders over $100</li> */}
                  <li>Delivery address and phone number must be provided at time of order</li>
                </ul>
                
                <h3 className="text-lg font-semibold mb-2">Pickup Service 📦</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Free pickup available at our designated location</li>
                  <li>Pickup must be arranged within 7 days of order confirmation</li>
                  <li>Valid ID required for pickup verification</li>
                  <li>Pickup hours: Monday-Friday 9AM-6PM, Saturday 10AM-4PM</li>
                </ul>
              </div>
            </section>

            {/* Refund Policy */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="text-red-700 mr-3" size={24} />
                <h2 className="text-xl font-semibold text-blue-900">Refund Policy</h2>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800 font-semibold">❌❌❌ NO REFUNDS (with clause)</p>
              </div>
              <div className="prose max-w-none text-gray-700">
                <p className="mb-4">
                  <strong>General Policy:</strong> Due to the nature of our thrift and preloved book business, 
                  we operate a strict no-refund policy. All sales are final.
                </p>
                
                <h3 className="text-lg font-semibold mb-2">Exceptions (Refund Clause):</h3>
                <p className="mb-2">Refunds may be considered ONLY in the following circumstances:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Significantly Misrepresented Condition:</strong> If the book received is in substantially worse condition than described</li>
                  <li><strong>Wrong Item Sent:</strong> If you receive a completely different book than ordered</li>
                  <li><strong>Damaged in Transit:</strong> If the book is damaged during shipping (must be reported within 48 hours)</li>
                  {/* <li><strong>Missing Pages:</strong> If the book has missing or torn pages not disclosed in the description</li> */}
                </ul>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                  <p className="text-yellow-800">
                    <strong>Important:</strong> Refund requests must be submitted within 3 days of delivery/pickup 
                    with photographic evidence. Refunds, if approved, will be processed within 5-10 business days.
                  </p>
                </div>
              </div>
            </section>

            {/* Inventory & Stockpile */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Clock className="text-orange-700 mr-3" size={24} />
                <h2 className="text-xl font-semibold text-blue-900">Inventory & Stockpile Management</h2>
              </div>
              <div className="prose max-w-none text-gray-700">
                <p className="mb-4">
                  <strong>4-Week Stockpile Policy:</strong> Our inventory operates on a rotating 4-week cycle 
                  to ensure fresh selections and efficient space management.
                </p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li>Books are typically held in our inventory for up to 4 weeks</li>
                  <li>Popular titles may sell out quickly and may not be restocked</li>
                  <li>New arrivals are added weekly, creating a constantly changing selection</li>
                  <li>Inventory levels shown on our website are updated regularly but not in real-time</li>
                  <li>We cannot guarantee availability until payment is confirmed</li>
                </ul>
              </div>
            </section>

            {/* User Responsibilities */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">User Responsibilities</h2>
              <div className="prose max-w-none text-gray-700">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate delivery/pickup information</li>
                  <li>Complete payment promptly to secure your order</li>
                  <li>Inspect items upon receipt and report issues within specified timeframes</li>
                  {/* <li>Treat our staff and facilities with respect during pickup</li> */}
                  <li>Understand that all books are pre-owned and may show normal wear</li>
                </ul>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Limitation of Liability</h2>
              <div className="prose max-w-none text-gray-700">
                <p>
                  {appName.name}' liability is limited to the purchase price of the item(s) in question. 
                  We are not responsible for any indirect, incidental, or consequential damages. 
                  Our maximum liability shall not exceed the total amount paid for your order.
                </p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Changes to Terms</h2>
              <div className="prose max-w-none text-gray-700">
                <p>
                  {appName.name} reserves the right to modify these terms and conditions at any time. 
                  Changes will be posted on this page with an updated revision date. 
                  Continued use of our services after changes constitutes acceptance of the new terms.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Questions About These Terms?</h2>
              <div className="prose max-w-none text-gray-700">
                <p className="mb-4">
                  If you have any questions about these Terms & Conditions, please contact us:
                </p>
                <ul className="list-none space-y-2">
                  <li><strong>Email:</strong> legal@{appName.email}</li>
                  {/* <li><strong>Phone:</strong> (123) 456-7890</li> */}
                  <li><strong>Address:</strong> {appName.address}</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsConditionsPage;