import React from 'react';
import Layout from '../components/layout/Layout';
import BookGrid from '../components/books/BookGrid';
import useBooksContext from '../context/useBooksContext';
import BookCardLoading from '../components/Loaders/BookCardLoading';
import { useGetBooks } from '../hooks/useGetBooks';

const NewReleasesPage: React.FC = () => {
  const { books } = useBooksContext() as BookContextType;

  const { booksData: recommendations, appState: recommendationsAppState } = useGetBooks(
      { pagination: { pageSize: 5, orderByField: "title", orderDirection: "asc" } })

  // Get books from the last 3 months
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  
  const newReleases = books
    .filter(book => new Date(book.publicationDate!) >= threeMonthsAgo)
    .sort((a, b) => 
      new Date(b.publicationDate!).getTime() - new Date(a.publicationDate!).getTime()
    );

  return (
    <Layout>
      <div className="container lg:max-w-7xl mx-auto px-2 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
          New Releases
        </h1>
        
        <BookGrid 
          books={newReleases}
          emptyMessage="No new releases found."
        />

        <section className="py-12 bg-white lg:px-3">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl mb-8 font-bold text-blue-900">
              Recommendations
            </h2>
            
            {
              recommendationsAppState?.isLoading ? <BookCardLoading /> : <BookGrid books={recommendations?.books} />
            }
          </div>
        </section>
      </div>

    </Layout>
  );
};

export default NewReleasesPage;