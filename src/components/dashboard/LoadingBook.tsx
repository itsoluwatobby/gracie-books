
export const LoadingBook = () => {

  const loadingClass = 'animate-pulse bg-gray-100 rounded-sm';
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className={"h-10 w-8 flex-shrink-0 mr-3 border" + loadingClass} />
          <p className={"text-sm font-medium text-gray-900 line-clamp-1 w-[10rem]" + loadingClass} />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <p className={`${loadingClass} h-6 w-20`}></p>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <p className={`${loadingClass} h-6 w-20`}></p>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <p className={`${loadingClass} h-6 w-20`}></p>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
        <p className="cursor-default">Edit</p>
      </td>
    </tr>
  );
}