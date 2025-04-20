import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
 
 export default function PageNotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigate(-1);
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [navigate])

  return (
    <Layout>
      <main className='w-full h-screen flex flex-col gap-y-2 items-center justify-center'>
        <h3 className='text-2xl'><span className='text-4xl'>Oops!!</span> Page Not Found</h3>
        <p className='animate-pulse text-sm text-gray-800'>Redirecting to previous page...</p>
      </main>
    </Layout>
  )
}