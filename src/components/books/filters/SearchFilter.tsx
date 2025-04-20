import React from 'react';
import { Search } from 'lucide-react';

type SearchInputProps = {
  searchQuery:  string;
  handleSearch: (e: React.FormEvent) => void;
  setSearchQuery: (value: React.SetStateAction<string>) => void;
}

export default function SearchFilter(
  {
    setSearchQuery, handleSearch, searchQuery,
  }: SearchInputProps
) {

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Search</h3>
      <form onSubmit={handleSearch} className="flex items-center h-10">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search books..."
          className="w-full border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-800 text-white p-2 rounded-r h-10 hover:bg-blue-700 transition-colors"
        >
          <Search size={18} />
        </button>
      </form>
    </div>
  )
}