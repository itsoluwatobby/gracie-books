import { LoaderIcon } from "lucide-react";
import useAuthContext from "../../context/useAuthContext";

export default function LoadingUI() {
  const { loading } = useAuthContext() as AuthContextType;

  return (
    <>
      {
        loading ?
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center w-full z-50 transition-all duration-300 h-full">
          <LoaderIcon className="rounded-full size-16 duration-300 animate-spin"/>
        </div>
        : null
      }
    </>
  )
}