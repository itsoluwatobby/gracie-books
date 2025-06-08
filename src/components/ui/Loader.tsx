import useAuthContext from "../../context/useAuthContext";

export default function LoadingUI() {
  const { loading } = useAuthContext() as AuthContextType;

  return (
    <>
      {
        loading ?
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center w-full z-50 transition-all duration-300 h-full">
          <div className="rounded-full size-20 border-4 border-y-green-800 border-t-green-700 border-r-green-300 border-l-green-600 animate-spin"/>
        </div>
        : null
      }
    </>
  )
}