import { LoaderIcon } from "lucide-react";

export default function LoadingContent() {

  return (
    <div className="container mx-auto px-4 py-12 xl:max-w-[65vw] h-[40vh]">
      <div className="bg-black bg-opacity-5 rounded-md flex items-center justify-center w-full z-50 transition-all duration-300 h-full">
        <LoaderIcon className="rounded-full size-14 duration-300 animate-spin"/>
      </div>
    </div>
  )
}