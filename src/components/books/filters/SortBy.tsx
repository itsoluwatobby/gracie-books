
type SortByProps = {
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
}

export default function SortBy(
{
  sortBy, setSortBy,
}: SortByProps
) {
  return (
    <>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="relevance">Relevance</option>
        <option value="price-low-high">Price: Low to High</option>
        <option value="price-high-low">Price: High to Low</option>
        <option value="newest">Newest Arrivals</option>
        <option value="bestselling">Bestselling</option>
      </select>
    </>
  )
}