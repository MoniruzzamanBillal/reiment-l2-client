"use client";

import ProductsFilter from "@/components/main/AllProducts/ProductsFilter";
import ProductCard from "@/components/shared/cards/ProductCard";
import ProductCardSkeleton from "@/components/shared/cards/ProductCardSkeleton";
import Wrapper from "@/components/shared/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSmartSearch } from "@/hooks/useAi";
import { useFetchData } from "@/hooks/useApi";
import { useSearchDebounce } from "@/hooks/useSearchDebounce";
import { useAuthStore } from "@/stores/useAuthStore";
import { TFollowData, TProductResponse } from "@/types";
import { buildUrl } from "@/utils/buildUrl";
import {
  LayoutGrid,
  SearchX,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const LIMIT = 9;

function AllProductsInner() {
  const searchParams = useSearchParams();
  const paramSearchTerm = searchParams.get("paramSearchTerm");
  const ParamCategory = searchParams.get("ParamCategory");

  const [page, setPage] = useState(1);

  const { search, setSearch, debouncedSearch } = useSearchDebounce();
  const [priceRange, setPriceRange] = useState<number | null>(null);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [followedOnly, setFollowedOnly] = useState(false);

  const user = useAuthStore((s) => s.user);
  const { data: followData } = useFetchData<TFollowData[]>(
    ["loggedUserFollow"],
    "/follow/logged-user-data",
    { enabled: !!user && user.role === "CUSTOMER" },
  );
  const followedShopIds: string[] = ((followData as any)?.data ?? []).map(
    (f: TFollowData) => f.shopId,
  );

  useEffect(() => {
    if (ParamCategory) setCategory(ParamCategory);
  }, [ParamCategory]);

  useEffect(() => {
    if (paramSearchTerm) setSearch(paramSearchTerm);
  }, [paramSearchTerm]);

  const url = buildUrl("/product/all-products", {
    page,
    limit: LIMIT,
    searchTerm: debouncedSearch || undefined,
    priceRange: priceRange || undefined,
    categoryId: category || undefined,
    sortBy: sort ? "price" : undefined,
    sortOrder: sort || undefined,
    shopIds:
      followedOnly && followedShopIds.length
        ? followedShopIds.join(",")
        : undefined,
  });

  const { data: allProducts, isLoading } = useFetchData<TProductResponse[]>(
    [
      "allProducts",
      String(page),
      debouncedSearch,
      category,
      sort,
      String(priceRange),
      String(followedOnly),
    ],
    url,
  );

  const [smartSearchActive, setSmartSearchActive] = useState(false);
  const [smartProducts, setSmartProducts] = useState<TProductResponse[]>([]);
  const [smartTotalItems, setSmartTotalItems] = useState(0);
  const { mutateAsync: smartSearchMutate, isPending: isSmartSearching } =
    useSmartSearch();

  const products: TProductResponse[] = smartSearchActive
    ? smartProducts
    : ((allProducts as any)?.data?.data ?? []);
  const totalItems: number = smartSearchActive
    ? smartTotalItems
    : ((allProducts as any)?.data?.meta?.totalItems ?? 0);
  const totalPages = Math.ceil(totalItems / LIMIT);

  const hasActiveFilters = !!priceRange || !!category || followedOnly;

  const runSmartSearch = async (pageArg: number = page) => {
    if (!debouncedSearch.trim()) return;
    const aiUrl = buildUrl("/ai/smart-search", {
      page: pageArg,
      limit: LIMIT,
      sortBy: sort ? "price" : undefined,
      sortOrder: sort || undefined,
    });
    try {
      const result: any = await smartSearchMutate({
        url: aiUrl,
        payload: { query: debouncedSearch },
      });
      setSmartProducts(result?.data?.data ?? []);
      setSmartTotalItems(result?.data?.meta?.totalItems ?? 0);
      setSmartSearchActive(true);
    } catch {
      // Silently fall back to the plain search path — a failed AI search
      // shouldn't surface an error for what the user perceives as "just a search".
      setSmartSearchActive(false);
    }
  };

  useEffect(() => {
    if (smartSearchActive) runSmartSearch(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSetCategory = (value: string) => {
    setSmartSearchActive(false);
    setCategory(value);
  };

  const handleSetPriceRange = (value: number | null) => {
    setSmartSearchActive(false);
    setPriceRange(value);
  };

  const handleReset = () => {
    setPage(1);
    setSearch("");
    setPriceRange(null);
    setCategory("");
    setSort("");
    setFollowedOnly(false);
    setSmartSearchActive(false);
    setSmartProducts([]);
    setSmartTotalItems(0);
  };

  return (
    <div className="AllProductsContainer bg-gray-50 min-h-screen pb-10">
      {/* Page banner */}
      <div className="bg-white border-b border-gray-200 pt-24 pb-5 px-4">
        <Wrapper>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-xl bg-prime100/10">
                <LayoutGrid className="size-5 text-prime100" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  All Products
                </h1>
                {!isLoading && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {totalItems} product{totalItems !== 1 ? "s" : ""} found
                  </p>
                )}
              </div>
            </div>

            {/* Mobile search */}
            <div className="xl:hidden flex items-center gap-2 w-full sm:w-72">
              <Input
                type="text"
                placeholder="Search products…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                  setSmartSearchActive(false);
                }}
                className="rounded-xl border-gray-200 bg-gray-50 text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                title="Search with AI"
                disabled={isSmartSearching || !search.trim()}
                onClick={() => {
                  setPage(1);
                  runSmartSearch(1);
                }}
                className="shrink-0 rounded-xl"
              >
                <Sparkles className="size-4" />
              </Button>
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-xs text-gray-500 font-medium">
                Active filters:
              </span>
              {priceRange && (
                <span className="inline-flex items-center gap-1 bg-prime100/10 text-prime100 text-xs font-semibold px-3 py-1 rounded-full">
                  Max ${priceRange}
                  <button
                    onClick={() => handleSetPriceRange(null)}
                    className="ml-0.5 hover:text-prime200"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              )}
              {category && (
                <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                  Category filtered
                  <button
                    onClick={() => handleSetCategory("")}
                    className="ml-0.5 hover:text-indigo-900"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              )}
              {followedOnly && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
                  Following only
                  <button
                    onClick={() => setFollowedOnly(false)}
                    className="ml-0.5 hover:text-emerald-900"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              )}
              <button
                onClick={handleReset}
                className="text-xs text-red-500 hover:underline font-medium ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </Wrapper>
      </div>

      <Wrapper className="pt-6">
        <div className="contentBody flex justify-between gap-x-4">
          {/* Desktop sidebar */}
          <div className="contentLeft w-0 xl:w-[22%] hidden xl:block">
            <ProductsFilter
              priceRange={priceRange}
              category={category}
              setPriceRange={handleSetPriceRange}
              setCategory={handleSetCategory}
              handleAddReset={handleReset}
              followedOnly={followedOnly}
              setFollowedOnly={setFollowedOnly}
              canFilterFollowed={!!user && user.role === "CUSTOMER"}
              hasFollowedShops={followedShopIds.length > 0}
            />
          </div>

          {/* Right content */}
          <div className="contentRight w-full xl:w-[78%] flex flex-col gap-y-4">
            {/* Top bar */}
            <div className="bg-white shadow-sm rounded-xl border border-gray-100 py-2.5 px-4 flex justify-between items-center gap-3">
              {/* Mobile filter trigger */}
              <div className="xl:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-x-1.5 rounded-lg"
                    >
                      <SlidersHorizontal className="size-4" />
                      Filter
                      {hasActiveFilters && (
                        <span className="ml-1 bg-prime100 text-white text-[10px] font-bold size-4 rounded-full flex items-center justify-center">
                          {(priceRange ? 1 : 0) +
                            (category ? 1 : 0) +
                            (followedOnly ? 1 : 0)}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <ProductsFilter
                      priceRange={priceRange}
                      category={category}
                      setPriceRange={setPriceRange}
                      setCategory={setCategory}
                      handleAddReset={handleReset}
                      followedOnly={followedOnly}
                      setFollowedOnly={setFollowedOnly}
                      canFilterFollowed={!!user && user.role === "CUSTOMER"}
                      hasFollowedShops={followedShopIds.length > 0}
                    />
                  </SheetContent>
                </Sheet>
              </div>

              {/* Desktop search */}
              <div className="hidden xl:flex searchSection bg-gray-50 border border-gray-200 w-[60%] m-auto py-0.5 px-2 rounded-full items-center gap-1">
                <Input
                  type="text"
                  placeholder="Search products…"
                  className="border-none bg-transparent focus-visible:ring-0 text-sm"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                    setSmartSearchActive(false);
                  }}
                />
                <Button
                  type="button"
                  variant={smartSearchActive ? "default" : "outline"}
                  size="icon-sm"
                  title="Search with AI"
                  disabled={isSmartSearching || !search.trim()}
                  onClick={() => {
                    setPage(1);
                    runSmartSearch(1);
                  }}
                  className="shrink-0 rounded-full"
                >
                  <Sparkles className="size-4" />
                </Button>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-x-1.5 text-xs sm:text-sm">
                <p className="text-gray-500 whitespace-nowrap">Sort by:</p>
                <Select
                  value={sort}
                  onValueChange={(value) => {
                    setSort(value);
                    setPage(1);
                    setSmartSearchActive(false);
                  }}
                >
                  <SelectTrigger className="w-[10rem] sm:w-[13rem] border-gray-200 rounded-lg text-xs sm:text-sm focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Low to High</SelectItem>
                    <SelectItem value="desc">High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products count + grid */}
            <div className="productsContent px-1">
              {!isLoading && products.length > 0 && (
                <p className="text-xs text-gray-400 mb-3 font-medium">
                  Showing {products.length} of {totalItems} products
                </p>
              )}
              <div className="allProducts mx-auto w-[85%] xsm:w-full grid grid-cols-1 xsm:grid-cols-2 xmd:grid-cols-3 gap-x-6 gap-y-7">
                {isLoading &&
                  Array.from({ length: 6 }).map((_, ind) => (
                    <ProductCardSkeleton key={ind} />
                  ))}
                {!isLoading && products.length === 0 && (
                  <div className="col-span-3 flex flex-col items-center justify-center py-20 text-center">
                    <div className="flex items-center justify-center size-16 rounded-2xl bg-gray-100 mb-4">
                      <SearchX className="size-8 text-gray-400" />
                    </div>
                    <p className="text-gray-700 font-semibold text-lg mb-1">
                      No products match your filters
                    </p>
                    <p className="text-gray-400 text-sm mb-5">
                      Try adjusting your search or clearing filters.
                    </p>
                    <Button
                      onClick={handleReset}
                      className="bg-prime100 hover:bg-prime200 rounded-xl px-6"
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
                {products.map((product) => (
                  <ProductCard product={product} key={product.id} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="paginationSection mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) setPage(page - 1);
                    }}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, ind) => (
                  <PaginationItem key={ind}>
                    <PaginationLink
                      href="#"
                      isActive={page === ind + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(ind + 1);
                      }}
                    >
                      {ind + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < totalPages) setPage(page + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Wrapper>
    </div>
  );
}

export default function AllProductsPage() {
  return (
    <Suspense>
      <AllProductsInner />
    </Suspense>
  );
}
