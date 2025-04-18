import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
 
 export default function PageNotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigate(-1);
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [navigate])

  return (
    <main className='w-screen h-screen flex items-center justify-center'>
      <h3 className='text-xl'><span className='text-2xl'>Oops!!</span> Page Not Found</h3>
      <p className='animate-pulse text-sm text-gray-800'>Redirecting to previous page...</p>
    </main>
  )
}