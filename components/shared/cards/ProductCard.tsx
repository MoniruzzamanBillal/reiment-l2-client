"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { useComparisonStore } from "@/stores/useComparisonStore";
import { TProductResponse } from "@/types";
import { useFetchData, usePatch, usePost } from "@/hooks/useApi";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import CartItemReplaceModal from "@/components/shared/modals/CartItemReplaceModal";
import { GitCompare, ShoppingCart, Store } from "lucide-react";

type TCart = {
  id: string;
  vendorId: string;
};

const ProductCard = ({ product }: { product: TProductResponse }) => {
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const user = useAuthStore((s) => s.user);
  const addToComparison = useComparisonStore((s) => s.addToComparison);

  const { data: cartData, refetch: refetchCart } = useFetchData<TCart>(
    ["userCart"],
    "/cart/my-cart",
    { enabled: user?.userRole === "CUSTOMER" }
  );

  const { mutateAsync: addToCartMutate, isPending: addingCart } = usePost([
    ["userCart"],
  ]);
  const { mutateAsync: replaceMutate } = usePatch([["userCart"]]);

  const handleAddCart = async () => {
    const cart = (cartData as any)?.data;
    if (!cart || product.shopId === cart.vendorId) {
      const toastId = toast.loading("Adding to cart…");
      try {
        const result: any = await addToCartMutate({
          url: "/cart/add-to-cart",
          payload: { productId: product.id, quantity: 1 },
        });
        if (result?.data?.success) {
          refetchCart();
          toast.success(result.data.message, { id: toastId, duration: 1500 });
        }
      } catch (err: any) {
        const msg =
          err?.response?.status === 401
            ? "Login to add product in the cart"
            : err?.response?.data?.message || "Failed";
        toast.error(msg, { id: toastId, duration: 1400 });
      }
    } else {
      setShowReplaceModal(true);
    }
  };

  const handleReplaceCart = async () => {
    const cart = (cartData as any)?.data;
    try {
      const result: any = await replaceMutate({
        url: "/cart/replace-cart",
        payload: { cartId: cart.id, productId: product.id, quantity: 1 },
      });
      if (result?.data?.success) {
        refetchCart();
        toast.success(result.data.message, { duration: 1600 });
        setShowReplaceModal(false);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed", { duration: 1400 });
    }
  };

  const handleCompare = () => {
    addToComparison(product as any);
    toast.success("Added to comparison");
  };

  const discountedPrice =
    product.discount && product.discount > 60
      ? product.price - product.discount
      : null;

  const isLowStock =
    product.inventoryCount > 0 && product.inventoryCount <= 5;

  return (
    <div className="ProductCardContainer group">
      <CartItemReplaceModal
        showReplaceModal={showReplaceModal}
        setShowReplaceModal={setShowReplaceModal}
        handleReplaceCart={handleReplaceCart}
      />

      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col">
        {/* Image section */}
        <Link href={`/product/${product.id}`} className="block relative h-[15rem] overflow-hidden">
          <Image
            src={product.productImg || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 25vw"
          />

          {/* Hover overlay with compare button */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCompare();
              }}
              className="flex items-center gap-2 bg-white/90 hover:bg-white text-gray-800 text-xs font-semibold px-4 py-2 rounded-full shadow-lg transition"
            >
              <GitCompare className="size-4 text-prime100" />
              Compare
            </button>
          </div>

          {/* Category badge — top left */}
          {product.category?.name && (
            <span className="absolute top-2.5 left-2.5 bg-white/90 text-indigo-700 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              {product.category.name}
            </span>
          )}

          {/* Discount badge — top right */}
          {discountedPrice && (
            <span className="absolute top-2.5 right-2.5 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              -{product.discount} off
            </span>
          )}
        </Link>

        {/* Body */}
        <div className="flex flex-col flex-1 p-3 gap-2">
          {/* Low stock warning */}
          {isLowStock && (
            <span className="inline-flex w-fit items-center gap-1 bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
              Only {product.inventoryCount} left
            </span>
          )}

          {/* Name */}
          <h2 className="font-semibold text-sm text-gray-800 line-clamp-2 leading-snug">
            {product.name}
          </h2>

          {/* Price + shop row */}
          <div className="flex items-center justify-between gap-2">
            {/* Price */}
            <div className="flex items-baseline gap-1.5">
              {discountedPrice ? (
                <>
                  <span className="font-bold text-base text-prime100">
                    ${discountedPrice}
                  </span>
                  <span className="text-xs line-through text-gray-400">
                    ${product.price}
                  </span>
                  <span className="text-[9px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded uppercase tracking-wide">
                    Sale
                  </span>
                </>
              ) : (
                <span className="font-bold text-base text-gray-900">
                  ${product.price}
                </span>
              )}
            </div>

            {/* Shop chip */}
            {product.shop?.name && (
              <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full text-gray-500 shrink-0 max-w-[40%]">
                <Store className="size-3 shrink-0" />
                <span className="text-[10px] font-medium truncate">{product.shop.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Add to Cart — full width */}
        <div className="px-3 pb-3">
          <Button
            disabled={addingCart}
            onClick={handleAddCart}
            className="w-full text-sm font-semibold text-white bg-prime100 hover:bg-prime200 rounded-xl"
          >
            <ShoppingCart className="size-4" />
            {addingCart ? "Adding…" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
