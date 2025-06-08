import { useEffect } from "react"
import { useNavigate } from "react-router-dom";

export default function UnauthorisedPage() {
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
    <div className="font-mono text-black flex flex-col gap-6 text-center w-full font-semibold p-4">
      <span className="text-4xl">Unauthorised from viewing Chapter</span>
      <span className="self-end p-2 animate-pulse">Redirecting...</span>
    </div>
  )
}