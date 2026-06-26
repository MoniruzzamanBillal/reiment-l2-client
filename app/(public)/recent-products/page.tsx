"use client";

import ProductCard from "@/components/shared/cards/ProductCard";
import ProductCardSkeleton from "@/components/shared/cards/ProductCardSkeleton";
import Wrapper from "@/components/shared/Wrapper";
import { useRecentProductsStore } from "@/stores/useRecentProductsStore";
import { TProductResponse } from "@/types";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiPatch } from "@/utils/api";
import { Clock, History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const RecentProductsPage = () => {
  const recentProductIds = useRecentProductsStore((s) => s.recentProductIds);
  const clearRecentProducts = useRecentProductsStore((s) => s.clearRecentProducts);
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<TProductResponse[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { mutate: fetchRecent, isPending } = useMutation({
    mutationFn: () =>
      apiPatch("/product/recent-products", { productIds: recentProductIds }),
    onSuccess: (data: any) => {
      setProducts(data?.data ?? []);
    },
  });

  useEffect(() => {
    if (mounted && recentProductIds.length > 0) {
      fetchRecent();
    }
  }, [mounted, recentProductIds.length]);

  if (!mounted) return null;

  return (
    <div className="RecentProductsContainer bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 pt-24 pb-8 px-4">
        <Wrapper>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-12 rounded-xl bg-prime100/10">
                <Clock className="size-6 text-prime100" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Recently Viewed
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {recentProductIds.length} product{recentProductIds.length !== 1 ? "s" : ""} in history
                </p>
              </div>
            </div>
            {recentProductIds.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  clearRecentProducts();
                  setProducts([]);
                }}
                className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 self-start sm:self-auto"
              >
                <Trash2 className="size-4" />
                Clear History
              </Button>
            )}
          </div>
        </Wrapper>
      </div>

      <Wrapper className="pt-8">
        {/* Empty state */}
        {recentProductIds.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex items-center justify-center size-20 rounded-full bg-gray-100 mb-5">
              <History className="size-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No recently viewed products
            </h2>
            <p className="text-gray-500 text-sm mb-6 max-w-xs">
              Start browsing and products you view will appear here for quick access.
            </p>
            <Link href="/products">
              <Button className="bg-prime100 hover:bg-prime200">
                Browse Products
              </Button>
            </Link>
          </div>
        )}

        {/* Products */}
        {recentProductIds.length > 0 && (
          <>
            <div className="border-t border-gray-200 pt-6" />
            <div className="products mx-auto w-[85%] xsm:w-full grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
              {isPending &&
                Array.from({ length: 4 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              {products.map((product) => (
                <ProductCard product={product} key={product.id} />
              ))}
            </div>
          </>
        )}
      </Wrapper>
    </div>
  );
};

export default RecentProductsPage;
