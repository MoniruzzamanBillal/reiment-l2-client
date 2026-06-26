"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useFetchData } from "@/hooks/useApi";
import { RotateCcw, SlidersHorizontal } from "lucide-react";

type TCategory = { id: string; name: string };
type TCategoryOption = { name: string; value: string };

type TProps = {
  priceRange: number | null;
  category: string;
  setPriceRange: (range: number) => void;
  setCategory: (category: string) => void;
  handleAddReset: () => void;
};

const ProductsFilter = ({
  priceRange,
  category,
  setPriceRange,
  setCategory,
  handleAddReset,
}: TProps) => {
  const { data: categoryData } = useFetchData<TCategory[]>(
    ["allCategory"],
    "/category/all-category"
  );

  const rawCategories: TCategory[] = (categoryData as any)?.data ?? [];
  const categoryOptions: TCategoryOption[] = [
    { name: "All", value: "" },
    ...rawCategories.map((item) => ({ name: item.name, value: item.id })),
  ];

  const hasActiveFilters = !!priceRange || !!category;

  return (
    <div className="ProductsFilterContainer flex flex-col gap-y-4 sticky top-4">
      {/* Header */}
      <div className="flex items-center gap-2 px-1">
        <SlidersHorizontal className="size-4 text-prime100" />
        <h1 className="font-bold text-gray-800 text-base">Filters</h1>
        {hasActiveFilters && (
          <span className="ml-auto bg-prime100/10 text-prime100 text-[10px] font-bold px-2 py-0.5 rounded-full">
            active
          </span>
        )}
      </div>

      {/* Price Range */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 py-4 px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-sm text-gray-700">Price Range</h2>
          {priceRange && (
            <span className="text-xs font-bold bg-prime100/10 text-prime100 px-2.5 py-0.5 rounded-full">
              Up to ${priceRange}
            </span>
          )}
        </div>
        <Slider
          value={[priceRange ?? 0]}
          onValueChange={(value) => setPriceRange(value[0])}
          max={2000}
          step={10}
          className="w-full"
        />
        <div className="mt-3 text-xs font-medium text-gray-500 flex justify-between">
          <span>$0</span>
          <span>$2,000</span>
        </div>
      </div>

      {/* Category */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 py-4 px-4">
        <h2 className="font-semibold text-sm text-gray-700 mb-3">Category</h2>
        <ul className="flex flex-col gap-y-1">
          {categoryOptions.map((item) => {
            const isActive = category === item.value;
            return (
              <li key={item.value || "all"}>
                <button
                  onClick={() => setCategory(item.value)}
                  className={`w-full text-left text-sm px-3 py-2 rounded-lg font-medium transition-colors ${
                    isActive
                      ? "bg-prime100 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {item.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          className="flex items-center gap-2 rounded-xl border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 w-full"
          onClick={handleAddReset}
        >
          <RotateCcw className="size-4" />
          Reset Filters
        </Button>
      )}
    </div>
  );
};

export default ProductsFilter;
