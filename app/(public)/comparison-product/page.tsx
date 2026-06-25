"use client";

import Wrapper from "@/components/shared/Wrapper";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useComparisonStore } from "@/stores/useComparisonStore";
import { TComparisonProduct } from "@/types";
import {
  ArrowRight,
  GitCompare,
  Package,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function getFinalPrice(product: TComparisonProduct): number {
  return product.discount && product.discount > 60
    ? product.price - product.discount
    : product.price;
}

function StockBadge({ count }: { count: number }) {
  if (count === 0)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-full">
        Out of Stock
      </span>
    );
  if (count <= 5)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200 px-2.5 py-1 rounded-full">
        Low Stock ({count})
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full">
      In Stock ({count})
    </span>
  );
}

export default function ComparisonProductPage() {
  const [mounted, setMounted] = useState(false);
  const { products, removeFromComparison, clearComparison } =
    useComparisonStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-44 bg-gradient-to-r from-indigo-600 via-prime100 to-violet-500" />
        <Wrapper className="pt-8">
          <Skeleton className="h-12 w-72 mb-6 rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
        </Wrapper>
      </div>
    );
  }

  const bestPrice =
    products.length > 0
      ? Math.min(...products.map((p) => getFinalPrice(p)))
      : null;

  const addMoreSlots = Math.max(0, 3 - products.length);

  return (
    <div className="ComparisonPage bg-gray-50 min-h-screen pb-16">
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-600 via-prime100 to-violet-500 pt-24 pb-10 px-4">
        <Wrapper>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="flex items-center justify-center size-16 sm:size-20 rounded-full bg-white/20 backdrop-blur-sm shrink-0">
              <GitCompare className="size-8 sm:size-10 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Compare Products
              </h1>
              <p className="mt-1 text-indigo-100 text-sm sm:text-base">
                Side-by-side comparison of up to 3 products
              </p>
            </div>
            <div className="sm:ml-auto flex items-center gap-3 flex-wrap justify-center">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full">
                <GitCompare className="size-4" />
                {products.length} of 3 products
              </div>
              {products.length > 0 && (
                <Button
                  onClick={clearComparison}
                  variant="outline"
                  size="sm"
                  className="border-white/50 text-white bg-white/10 hover:bg-red-500 hover:border-red-500 rounded-full gap-2"
                >
                  <Trash2 className="size-3.5" />
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </Wrapper>
      </div>

      <Wrapper className="pt-8">
        {/* Empty state */}
        {products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="flex items-center justify-center size-24 rounded-full bg-gray-100 mb-6">
              <GitCompare className="size-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              No products to compare
            </h2>
            <p className="text-gray-500 text-sm mb-8 max-w-sm">
              Browse our catalog and click the{" "}
              <strong>Compare</strong> button on any product card to start
              comparing.
            </p>
            <Link href="/products">
              <Button className="bg-prime100 hover:bg-prime200 rounded-xl px-8 gap-2">
                Browse Products
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        )}

        {/* Comparison table */}
        {products.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
            <table className="bg-white w-full min-w-[600px]">
              {/* Product header cards */}
              <thead>
                <tr className="border-b border-gray-100">
                  {/* Label column header */}
                  <th className="bg-gray-50 p-4 w-36 min-w-[9rem]" />

                  {/* Product columns */}
                  {products.map((product: TComparisonProduct) => (
                    <th
                      key={product.id}
                      className="p-4 align-top border-l border-gray-100"
                    >
                      <div className="relative flex flex-col items-center gap-3">
                        {/* Product image with remove button overlaid */}
                        <div className="relative w-full h-40 rounded-xl overflow-hidden bg-white border border-gray-100">
                          <Image
                            src={product.productImg || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-contain"
                            sizes="220px"
                          />
                          {/* Remove button — inside image container so it's always on top */}
                          <button
                            onClick={() => removeFromComparison(product.id)}
                            className="absolute top-2 right-2 z-10 flex items-center justify-center size-6 rounded-full bg-red-100 hover:bg-red-500 text-red-500 hover:text-white transition shadow-sm"
                            title="Remove"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>

                        {/* Product name */}
                        <p className="font-bold text-sm text-gray-800 line-clamp-2 text-center leading-snug">
                          {product.name}
                        </p>

                        {/* View product link */}
                        <Link
                          href={`/product/${product.id}`}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-prime100 hover:text-prime200 hover:underline"
                        >
                          View Product
                          <ArrowRight className="size-3" />
                        </Link>
                      </div>
                    </th>
                  ))}

                  {/* Add-more placeholder columns */}
                  {addMoreSlots > 0 &&
                    Array.from({ length: addMoreSlots }).map((_, i) => (
                      <th
                        key={`add-${i}`}
                        className="p-4 border-l border-dashed border-gray-200 align-middle"
                      >
                        <Link href="/products">
                          <div className="flex flex-col items-center justify-center gap-3 h-40 rounded-xl border-2 border-dashed border-gray-200 hover:border-prime100 hover:bg-prime100/5 transition cursor-pointer">
                            <div className="flex items-center justify-center size-10 rounded-full bg-gray-100">
                              <Plus className="size-5 text-gray-400" />
                            </div>
                            <p className="text-xs text-gray-400 font-medium text-center px-2">
                              Add a product
                            </p>
                          </div>
                        </Link>
                      </th>
                    ))}
                </tr>
              </thead>

              <tbody>
                {/* Price row */}
                <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                  <td className="p-4 bg-gray-50 border-r border-gray-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Price
                    </span>
                  </td>
                  {products.map((product: TComparisonProduct) => {
                    const finalPrice = getFinalPrice(product);
                    const hasDiscount =
                      product.discount && product.discount > 60;
                    const isBest = finalPrice === bestPrice;
                    return (
                      <td
                        key={product.id}
                        className="p-4 text-center border-l border-gray-100"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xl font-extrabold text-prime100">
                            ${finalPrice}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs line-through text-gray-400">
                              ${product.price}
                            </span>
                          )}
                          {isBest && products.length > 1 && (
                            <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                              Best Price
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  {addMoreSlots > 0 &&
                    Array.from({ length: addMoreSlots }).map((_, i) => (
                      <td key={`add-p-${i}`} className="border-l border-dashed border-gray-200" />
                    ))}
                </tr>

                {/* Discount row */}
                <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                  <td className="p-4 bg-gray-50 border-r border-gray-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Discount
                    </span>
                  </td>
                  {products.map((product: TComparisonProduct) => (
                    <td
                      key={product.id}
                      className="p-4 text-center border-l border-gray-100"
                    >
                      {product.discount && product.discount > 60 ? (
                        <span className="text-sm font-semibold text-green-600">
                          Save ${product.discount}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                  ))}
                  {addMoreSlots > 0 &&
                    Array.from({ length: addMoreSlots }).map((_, i) => (
                      <td key={`add-d-${i}`} className="border-l border-dashed border-gray-200" />
                    ))}
                </tr>

                {/* Stock row */}
                <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                  <td className="p-4 bg-gray-50 border-r border-gray-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Stock
                    </span>
                  </td>
                  {products.map((product: TComparisonProduct) => (
                    <td
                      key={product.id}
                      className="p-4 text-center border-l border-gray-100"
                    >
                      <div className="flex justify-center">
                        <StockBadge count={product.inventoryCount} />
                      </div>
                    </td>
                  ))}
                  {addMoreSlots > 0 &&
                    Array.from({ length: addMoreSlots }).map((_, i) => (
                      <td key={`add-s-${i}`} className="border-l border-dashed border-gray-200" />
                    ))}
                </tr>

                {/* Description row */}
                <tr className="hover:bg-gray-50/50 transition">
                  <td className="p-4 bg-gray-50 border-r border-gray-100 align-top">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Description
                    </span>
                  </td>
                  {products.map((product: TComparisonProduct) => (
                    <td
                      key={product.id}
                      className="p-4 text-sm text-gray-600 align-top border-l border-gray-100"
                    >
                      <div
                        className="line-clamp-5 leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                      />
                    </td>
                  ))}
                  {addMoreSlots > 0 &&
                    Array.from({ length: addMoreSlots }).map((_, i) => (
                      <td key={`add-desc-${i}`} className="border-l border-dashed border-gray-200" />
                    ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Hint */}
        {products.length > 0 && (
          <p className="mt-4 text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
            <Package className="size-3.5" />
            Use the Compare button on any product card to add more items (max 3 from the same category).
          </p>
        )}
      </Wrapper>
    </div>
  );
}
