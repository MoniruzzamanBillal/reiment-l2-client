/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ProductCard from "@/components/shared/cards/ProductCard";
import ProductCardSkeleton from "@/components/shared/cards/ProductCardSkeleton";
import { useFetchData } from "@/hooks/useApi";
import { TWishlistData } from "@/types";

export default function Wishlist() {
  const {
    data: wishlistData,
    isLoading,
    isError,
  } = useFetchData<TWishlistData[]>(
    ["loggedUserWishlist"],
    "/wishlist/logged-user-data",
  );

  const wishlist: TWishlistData[] = (wishlistData as any)?.data ?? [];

  let content = null;

  if (isLoading) {
    content = (
      <div className="grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 4 }).map((_, ind) => (
          <ProductCardSkeleton key={ind} />
        ))}
      </div>
    );
  } else if (isError) {
    content = <p className="p-8 text-center text-red-500">Something went wrong</p>;
  } else if (wishlist.length === 0) {
    content = (
      <p className="p-8 text-center text-gray-500">
        Your wishlist is empty. Tap the heart icon on any product to save it here.
      </p>
    );
  } else {
    content = (
      <div className="grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-3 gap-4">
        {wishlist.map((item) => (
          <ProductCard key={item.id} product={item.product as any} />
        ))}
      </div>
    );
  }

  return (
    <div className="WishlistContainer">
      <div className="WishlistWrapper bg-gray-100 border border-gray-300 shadow rounded-md p-3">
        <h3 className="text-2xl font-medium mb-6">Wishlist</h3>
        {content}
      </div>
    </div>
  );
}
