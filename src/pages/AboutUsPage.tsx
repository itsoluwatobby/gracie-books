import React from 'react';
import { BookOpen } from 'lucide-react';
import Layout from '../components/layout/Layout';
import useAuthContext from '../context/useAuthContext';
import WhatWeStandFor from '../components/WhatWeStandFor';
import HowWeWork from '../components/HowWeWork';

const AboutUsPage: React.FC = () => {
  const { appName } = useAuthContext() as AuthContextType;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-lg p-8 md:p-12 mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <BookOpen size={48} className="text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              About {appName.name} 🤗
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-6">
              Your destination for thrift & preloved books
            </p>
            <p className="text-lg text-blue-200 max-w-2xl mx-auto">
              We believe every book deserves a second chance to inspire, educate, and entertain. 
              Join us in our mission to make reading affordable and sustainable.
            </p>
          </div>
        </div>

        {/* Our Story */}
        <section className="mb-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6 text-center">Our Story</h2>
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 mb-4">
                  {appName.name} was born from a simple belief: great books shouldn't be expensive, and good books shouldn't go to waste. 
                  We started as a small community initiative to rescue preloved books and give them new homes where they can continue 
                  to spark imagination and knowledge.
                </p>
                <p className="text-lg text-gray-700 mb-4">
                  What began as a weekend hobby has grown into a thriving marketplace for book lovers who appreciate both quality 
                  literature and sustainable shopping. Every book in our collection has been carefully selected, ensuring that 
                  you receive titles in excellent condition at unbeatable prices.
                </p>
                <p className="text-lg text-gray-700">
                  Today, we're proud to serve thousands of readers who share our passion for books and our commitment to 
                  environmental responsibility. When you shop with us, you're not just buying a book – you're joining a 
                  community that values sustainability, affordability, and the timeless joy of reading.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <WhatWeStandFor />

        {/* How We Work */}
        <HowWeWork />

        {/* Our Impact */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-8 text-center">Our Impact</h2>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">10,000+</div>
                <div className="text-gray-700">Books Rescued</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">5,000+</div>
                <div className="text-gray-700">Happy Readers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">2 Tons</div>
                <div className="text-gray-700">Waste Prevented</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section 
        id="contact-us"
        className="text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Join Our Community</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Have questions, suggestions, or books to donate? We'd love to hear from you! 
              Together, we can make reading more accessible and sustainable for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={`mailto:${appName.email}`} 
                className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Contact Us
              </a>
              <a 
                href="/books" 
                className="border border-blue-900 text-blue-900 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Browse Books
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AboutUsPage;