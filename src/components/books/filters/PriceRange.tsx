import { CURRENCY } from "../../../utils/constants"

type PriceRangeProps = {
  initPriceRange: PriceRangePropTypes;
  priceRange: PriceRangePropTypes;
  setPriceRange: (value: React.SetStateAction<PriceRangePropTypes>) => void;
}

export default function PriceRange(
  {
    initPriceRange, priceRange,
    setPriceRange,
  }: PriceRangeProps
) {

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
      <div className="flex items-center">
        <span className="text-gray-600">{CURRENCY.NAIRA}</span>
        <input
          type="number"
          min={initPriceRange.min}
          max={priceRange.max}
          value={priceRange.min}
          onChange={(e) => setPriceRange((prev) => ({ ...prev, min: Number(e.target.value) }))}
          className="w-20 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <span className="mx-2">-</span>
        <span className="text-gray-600">{CURRENCY.NAIRA}</span>
        <input
          type="number"
          min={priceRange.min}
          value={priceRange.max}
          onChange={(e) => setPriceRange((prev) => ({ ...prev, max: Number(e.target.value) }))}
          className="w-20 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <input
        type="range"
        min={priceRange.min}
        max={initPriceRange.max}
        value={priceRange.max}
        onChange={(e) => setPriceRange((prev) => ({ ...prev, max: Number(e.target.value) }))}
        className="w-full mt-2"
      />
    </div>
  )
}