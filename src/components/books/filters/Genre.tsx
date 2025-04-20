
type GenreProps = {
  allGenres: string[];
  selectedGenres: string[];
  toggleGenre: (genre: string) => void;
}

export default function Genre(
  {
    allGenres, toggleGenre, selectedGenres
  }: GenreProps
) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Genres</h3>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {allGenres.map((genre, index) => (
          <div key={index} className="flex items-center">
            <input
              type="checkbox"
              id={`mobile-genre-${index}`}
              checked={selectedGenres.includes(genre)}
              onChange={() => toggleGenre(genre)}
              className="mr-2"
            />
            <label htmlFor={`mobile-genre-${index}`} className="text-sm text-gray-700">
              {genre}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}