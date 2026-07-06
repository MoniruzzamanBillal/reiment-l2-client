"use client";

import { TProductResponse } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default function ChatProductCard({
  product,
}: {
  product: TProductResponse;
}) {
  const discountedPrice =
    product.discount && product.discount > 60
      ? product.price - product.discount
      : null;

  return (
    <Link
      href={`/product/${product.id}`}
      className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-2 hover:shadow-sm transition-shadow"
    >
      <div className="relative size-12 shrink-0 rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={product.productImg || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover"
          sizes="48px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-gray-800 line-clamp-1">
          {product.name}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-prime100">
            ${discountedPrice ?? product.price}
          </span>
          {discountedPrice && (
            <span className="text-[10px] line-through text-gray-400">
              ${product.price}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
