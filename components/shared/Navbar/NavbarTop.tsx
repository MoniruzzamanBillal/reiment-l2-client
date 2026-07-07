"use client";

import ChatProductCard from "@/components/shared/ChatWidget/ChatProductCard";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { useFetchData } from "@/hooks/useApi";
import { useDebounce } from "@/hooks/useDebounce";
import { useAuthStore } from "@/stores/useAuthStore";
import { useComparisonStore } from "@/stores/useComparisonStore";
import { TCart, TProductResponse } from "@/types";
import { buildUrl } from "@/utils/buildUrl";
import { Loader2, SearchX } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { IoMdGitCompare } from "react-icons/io";
import { LuUser } from "react-icons/lu";

const SEARCH_PREVIEW_LIMIT = 5;

type NavSearchInputProps = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  handleSearchProduct: () => void;
};

const NavbarTop = ({
  searchTerm,
  setSearchTerm,
  handleSearchProduct,
}: NavSearchInputProps) => {
  const user = useAuthStore((s) => s.user);
  const comparisonProducts = useComparisonStore((s) => s.products);

  const { data: cartData } = useFetchData<TCart>(
    ["userCart"],
    "/cart/my-cart",
    {
      enabled: user?.userRole === "CUSTOMER",
    },
  );

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm.trim(), 500);

  const previewUrl = buildUrl("/product/all-products", {
    searchTerm: debouncedSearchTerm || undefined,
    limit: SEARCH_PREVIEW_LIMIT,
    page: 1,
  });

  const { data: previewData, isFetching: isPreviewLoading } = useFetchData<
    TProductResponse[]
  >(["navSearchPreview", debouncedSearchTerm], previewUrl, {
    enabled: !!debouncedSearchTerm,
  });

  const previewProducts: TProductResponse[] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (previewData as any)?.data?.data ?? [];

  // Reopen the popover whenever a new debounced term comes in (adjusting
  // state during render instead of an effect, per React's guidance).
  const [lastOpenedTerm, setLastOpenedTerm] = useState(debouncedSearchTerm);
  if (debouncedSearchTerm !== lastOpenedTerm) {
    setLastOpenedTerm(debouncedSearchTerm);
    setIsPopoverOpen(!!debouncedSearchTerm);
  }

  const closePreview = () => setIsPopoverOpen(false);

  const handleEnterSearch = () => {
    closePreview();
    handleSearchProduct();
  };

  const handleSelectProduct = () => {
    closePreview();
    setSearchTerm("");
  };

  return (
    <div className="flex justify-between py-1">
      {/* left section */}
      <div className="flex justify-between items-center w-[70%] md:w-[60%] lg:w-[45%]">
        {/* logo */}
        <div>
          <Link href="/">
            <p className="text-2xl sm:text-3xl font-bold font-headingFont">
              Rei<span className="text-indigo-600">ment</span>
            </p>
          </Link>
        </div>

        {/* search */}
        <div className="hidden sm:block sm:w-[70%]">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverAnchor asChild>
              <div className="flex gap-x-2">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => {
                    if (debouncedSearchTerm) setIsPopoverOpen(true);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleEnterSearch()}
                  className="w-full border border-gray-200 rounded-full px-4 py-1.5 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all"
                />
                <Button
                  onClick={handleEnterSearch}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full"
                >
                  Search
                </Button>
              </div>
            </PopoverAnchor>
            <PopoverContent
              align="start"
              onOpenAutoFocus={(e) => e.preventDefault()}
              className="w-106 p-2  "
            >
              {isPreviewLoading ? (
                <div className="flex items-center justify-center gap-x-2 py-4 text-sm text-gray-500">
                  <Loader2 className="size-4 animate-spin" />
                  Searching...
                </div>
              ) : previewProducts.length > 0 ? (
                <div className="flex flex-col gap-y-1.5">
                  {previewProducts.map((product) => (
                    <div key={product.id} onClick={handleSelectProduct}>
                      <ChatProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-y-1.5 py-4 text-center text-sm text-gray-500">
                  <SearchX className="size-5" />
                  No products found for &quot;{debouncedSearchTerm}&quot;
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* right icon section */}
      <div className="flex justify-between items-center gap-x-8 sm:gap-x-6 md:gap-x-5">
        {/* comparison */}
        <Link href="/comparison-product" className="relative">
          <IoMdGitCompare className="text-xl" />
          {comparisonProducts?.length > 0 && (
            <div className="text-gray-100 text-center size-5 bg-indigo-600 text-xs rounded-full absolute transform -translate-x-1/2 -translate-y-1/2 top-[0rem] left-[1.6rem]">
              {comparisonProducts.length}
            </div>
          )}
        </Link>

        {/* cart */}
        {user?.userRole === "CUSTOMER" && (
          <Link href="/cart">
            <div className="pl-0 md:pl-2 mr-3 md:pr-0 cursor-pointer text-2xl relative">
              <FiShoppingCart />
              {(cartData?.data as TCart)?.cartItem?.length > 0 && (
                <div className="text-gray-100 text-center size-5 bg-indigo-600 text-xs rounded-full absolute transform -translate-x-1/2 -translate-y-1/2 top-[0rem] left-[2rem]">
                  {(cartData?.data as TCart)?.cartItem?.length}
                </div>
              )}
            </div>
          </Link>
        )}

        {/* user */}
        {!user ? (
          <Link href="/login">
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm"
            >
              Sign in
            </Button>
          </Link>
        ) : (
          <Link
            href="/dashboard"
            className="inline-block p-2 rounded-full bg-indigo-50 cursor-pointer"
          >
            <LuUser className="text-2xl font-bold text-gray-800" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default NavbarTop;
