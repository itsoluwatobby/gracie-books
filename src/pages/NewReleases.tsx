import React from 'react';
import Layout from '../components/layout/Layout';
import BookGrid from '../components/books/BookGrid';
import { books } from '../data/books';

const NewReleasesPage: React.FC = () => {
  // Get books from the last 3 months
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  
  const newReleases = books
    .filter(book => new Date(book.publicationDate) >= threeMonthsAgo)
    .sort((a, b) => 
      new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime()
    );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
          New Releases
        </h1>
        
        <BookGrid 
          books={newReleases}
          emptyMessage="No new releases found."
        />
      </div>
    </Layout>
  );
};

export default NewReleasesPage;