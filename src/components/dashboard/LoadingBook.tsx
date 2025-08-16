
export const LoadingBook = () => {

  const loadingClass = 'animate-pulse bg-gray-100 rounded-sm';
  return (
    <tr className="hover:bg-gray-50 text-center">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className={"h-10 w-8 flex-shrink-0 mr-3 border" + loadingClass} />
          <div className={"text-sm font-medium text-gray-900 line-clamp-1 w-[10rem]" + loadingClass} />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className={`${loadingClass} h-6 w-20`}></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className={`${loadingClass} h-6 w-20`}></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`${loadingClass} h-6 w-20`}></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap max-sm:text-center">
        <button 
        className={`border px-3 py-1 rounded-xl text-sm bg-green-100 border-green-200 ${loadingClass}`}>
          public
        </button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center text-sm flex items-center gap-3">
        <div className="cursor-default h-9 w-14 grid place-content-center">Edit</div>
        <div className="cursor-default h-9 w-14 grid place-content-center">Delete</div>
      </td>
    </tr>
  );
}