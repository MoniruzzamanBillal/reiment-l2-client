"use client";

import { Button } from "@/components/ui/button";
import { TProductDetail } from "@/types";
import { GitCompare, ShoppingCart, Truck } from "lucide-react";
import { FaStar, FaRegStar } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

type TProps = {
  productData: TProductDetail | null;
  userRole: string | null;
  handleAddCart: (product: TProductDetail) => void;
  addProductComparison: (product: TProductDetail) => void;
};

const ProductDetailTop = ({
  productData,
  userRole,
  handleAddCart,
  addProductComparison,
}: TProps) => {
  if (!productData) return null;

  const discountedPrice = productData.discount
    ? productData.price - productData.discount
    : null;
  const displayPrice = discountedPrice ?? productData.price;

  const avgRating =
    productData.review?.length
      ? productData.review.reduce((sum, r) => sum + r.rating, 0) / productData.review.length
      : 0;
  const reviewCount = productData.review?.length ?? 0;
  const inStock = productData.inventoryCount > 0;

  return (
    <div className="mx-auto max-w-screen-lg px-4 md:px-8">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-8">
        <div className="grid gap-8 md:grid-cols-2">

          {/* Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl bg-gray-50 h-[22rem] md:h-[30rem] w-full">
              <Image
                src={productData.productImg || "/placeholder.svg"}
                alt={productData.name}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {discountedPrice && (
                <div className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                  SAVE ${productData.discount}
                </div>
              )}
              {!inStock && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-2xl">
                  <span className="bg-red-100 text-red-600 font-semibold text-sm px-4 py-2 rounded-full border border-red-200">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4">

            {/* Category pill */}
            <div>
              <span className="bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full">
                {productData.category?.name}
              </span>
            </div>

            {/* Name */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
              {productData.name}
            </h1>

            {/* Rating row */}
            {reviewCount > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }, (_, i) =>
                    i < Math.round(avgRating) ? (
                      <FaStar key={i} className="text-yellow-400 text-sm" />
                    ) : (
                      <FaRegStar key={i} className="text-gray-300 text-sm" />
                    )
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {avgRating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-indigo-600">
                ${displayPrice}
              </span>
              {discountedPrice && (
                <span className="text-lg text-gray-400 line-through mb-0.5">
                  ${productData.price}
                </span>
              )}
            </div>

            {/* Stock badge */}
            <div>
              {inStock ? (
                <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  In Stock ({productData.inventoryCount} available)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-200 text-xs font-semibold px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  Out of Stock
                </span>
              )}
            </div>

            {/* Delivery */}
            <div className="flex items-center gap-2 text-gray-500">
              <Truck className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-sm">2–4 day shipping • Free over $50</span>
            </div>

            {/* Sold by */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Sold by</p>
              <Link
                href={`/shop/${productData.shop?.id}`}
                className="text-indigo-600 font-semibold hover:text-indigo-700 text-sm transition-colors"
              >
                {productData.shop?.name}
              </Link>
            </div>

            {/* Action buttons */}
            {userRole !== "VENDOR" && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2">
                <Button
                  disabled={!inStock}
                  onClick={() => handleAddCart(productData)}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-full font-semibold text-sm py-5 transition-all ${
                    inStock
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => addProductComparison(productData)}
                  className="flex items-center justify-center gap-2 rounded-full border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold text-sm py-5 px-6"
                >
                  <GitCompare className="w-4 h-4" />
                  Compare
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailTop;
