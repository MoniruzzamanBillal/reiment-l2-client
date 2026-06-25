"use client";

import FlashSaleProductCard from "@/components/shared/cards/FlashSaleProductCard";
import ProductCardSkeleton from "@/components/shared/cards/ProductCardSkeleton";
import Wrapper from "@/components/shared/Wrapper";
import { useFetchData } from "@/hooks/useApi";
import { TProductResponse } from "@/types";
import { Zap } from "lucide-react";

const FlashSalePage = () => {
  const { data: allProducts, isLoading } = useFetchData<TProductResponse[]>(
    ["flashsaleProducts"],
    "/product/flashsale-products"
  );

  const products: TProductResponse[] = (allProducts as any)?.data ?? [];

  return (
    <div className="FlashSaleContainer bg-gray-50 min-h-screen pb-12">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 pt-24 pb-10 px-4">
        <Wrapper>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="flex items-center justify-center size-16 sm:size-20 rounded-full bg-white/20 backdrop-blur-sm shrink-0">
              <Zap className="size-8 sm:size-10 text-yellow-300 fill-yellow-300" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-white tracking-tight">
                Flash Sale
              </h1>
              <p className="mt-1 text-red-100 text-sm sm:text-base">
                Limited-time deals — grab them before they&apos;re gone
              </p>
            </div>
            {!isLoading && (
              <div className="sm:ml-auto flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full">
                <Zap className="size-4 text-yellow-300 fill-yellow-300" />
                {products.length} deals available
              </div>
            )}
          </div>
        </Wrapper>
      </div>

      {/* Products Grid */}
      <Wrapper className="pt-10">
        <div className="border-2 border-dashed border-red-200 rounded-2xl p-4 sm:p-6 bg-white">
          <div className="allProducts mx-auto w-[85%] xsm:w-full grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
            {isLoading &&
              Array.from({ length: 8 }).map((_, ind) => (
                <ProductCardSkeleton key={ind} />
              ))}
            {!isLoading && products.length === 0 && (
              <div className="col-span-4 text-center py-20">
                <Zap className="mx-auto size-12 text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No flash sale products right now.</p>
                <p className="text-gray-400 text-sm mt-1">Check back soon!</p>
              </div>
            )}
            {products.map((product) => (
              <FlashSaleProductCard product={product as any} key={product.id} />
            ))}
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default FlashSalePage;
