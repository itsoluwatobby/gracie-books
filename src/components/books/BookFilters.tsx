import React from 'react'
import SearchFilter from './filters/SearchFilter'
import PriceRange from './filters/PriceRange';
import Genre from './filters/Genre';
import SortBy from './filters/SortBy';

type BookFilterProps = {
  allGenres: string[];
  sortBy: string;
  searchQuery:  string;
  selectedGenres: string[];
  priceRange: PriceRangePropTypes;
  initPriceRange: PriceRangePropTypes;
  handleSearch: (e: React.FormEvent) => void;
  setSearchQuery: (value: React.SetStateAction<string>) => void;
  setShowFilters: (value: React.SetStateAction<boolean>) => void;
  setPriceRange: (value: React.SetStateAction<PriceRangePropTypes>) => void;
  toggleGenre: (genre: string) => void;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
}

export default function BookFilter(
  {
    setSearchQuery, handleSearch, searchQuery,
    initPriceRange, priceRange,
    setPriceRange, allGenres, selectedGenres,
    toggleGenre, sortBy, setSortBy,
  }: BookFilterProps
) {

  return (
    <>
      <SearchFilter 
        searchQuery={searchQuery}
        handleSearch={handleSearch}
        setSearchQuery={setSearchQuery}
      />

      <PriceRange 
        initPriceRange={initPriceRange}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />
      
      <Genre 
        allGenres={allGenres}
        selectedGenres={selectedGenres}
        toggleGenre={toggleGenre}
      />

      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Sort By</h3>
        <SortBy sortBy={sortBy} setSortBy={setSortBy} />
      </div>
    </>
  )
}