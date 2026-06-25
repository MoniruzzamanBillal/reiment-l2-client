"use client";

import ShopCard from "@/components/shared/cards/ShopCard";
import ShopCardSkeleton from "@/components/shared/cards/ShopCardSkeleton";
import Wrapper from "@/components/shared/Wrapper";
import { useFetchData } from "@/hooks/useApi";
import { TShopDetail } from "@/types";
import { Search, Store } from "lucide-react";
import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortOption = "default" | "az" | "za";

const ShopsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("default");

  const { data: allShopData, isLoading } = useFetchData<TShopDetail[]>(
    ["allPublicShop"],
    "/shop/all-shop"
  );

  const shops: TShopDetail[] = (allShopData as any)?.data ?? [];

  const displayedShops = useMemo(() => {
    let result = shops.filter((s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (sort === "az") result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "za") result = [...result].sort((a, b) => b.name.localeCompare(a.name));
    return result;
  }, [shops, searchQuery, sort]);

  return (
    <div className="ShopsContainer bg-gray-50 min-h-screen pb-12">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-prime100 to-violet-500 pt-24 pb-10 px-4">
        <Wrapper>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="flex items-center justify-center size-16 sm:size-20 rounded-full bg-white/20 backdrop-blur-sm shrink-0">
              <Store className="size-8 sm:size-10 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-white tracking-tight">
                Discover Shops
              </h1>
              <p className="mt-1 text-indigo-100 text-sm sm:text-base">
                Browse our curated marketplace of trusted vendors
              </p>
            </div>
            {!isLoading && (
              <div className="sm:ml-auto flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full">
                <Store className="size-4" />
                {shops.length} shops
              </div>
            )}
          </div>
        </Wrapper>
      </div>

      {/* Controls + results bar */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <Wrapper>
          <div className="py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative flex-1 sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search shops…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-prime100/30 focus:border-prime100 transition"
              />
            </div>

            {/* Sort */}
            <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
              <SelectTrigger className="w-full sm:w-44 rounded-xl border-gray-200 text-sm focus:ring-0">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="az">Name A – Z</SelectItem>
                <SelectItem value="za">Name Z – A</SelectItem>
              </SelectContent>
            </Select>

            {/* Count */}
            {!isLoading && (
              <p className="text-xs text-gray-400 font-medium sm:ml-auto whitespace-nowrap">
                {searchQuery
                  ? `${displayedShops.length} of ${shops.length} shops`
                  : `${shops.length} shops`}
              </p>
            )}
          </div>
        </Wrapper>
      </div>

      <Wrapper className="pt-8">
        {/* No results */}
        {!isLoading && displayedShops.length === 0 && (
          <div className="text-center py-20">
            <Store className="mx-auto size-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">
              {searchQuery ? `No shops matching "${searchQuery}"` : "No shops found"}
            </p>
          </div>
        )}

        <div className="shopcards mx-auto w-[85%] xsm:w-full grid grid-cols-1 xsm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading &&
            Array.from({ length: 8 }).map((_, ind) => (
              <ShopCardSkeleton key={ind} />
            ))}
          {displayedShops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      </Wrapper>
    </div>
  );
};

export default ShopsPage;
