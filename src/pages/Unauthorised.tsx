import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";

const UnauthorisedPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate(-1);
    }, 3500);

    return () => {
      clearTimeout(timeout);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout>
      <div className="font-mono mx-auto flex flex-col items-center justify-center text-black gap-6 text-center md:max-w-4xl w-full font-semibold p-4 h-screen">
        <span className="text-4xl">Unauthorised from viewing Chapter</span>
        <span className="self-end p-2 animate-pulse">Redirecting...</span>
      </div>
    </Layout>
  )
}
export default UnauthorisedPage;