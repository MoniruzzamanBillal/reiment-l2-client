"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { useFetchData, usePatch, usePost } from "@/hooks/useApi";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IoMdCart } from "react-icons/io";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CartItemReplaceModal from "@/components/shared/modals/CartItemReplaceModal";

type TFlashProduct = {
  id: string;
  shopId: string;
  name: string;
  price: number;
  discount: number;
  productImg: string;
  category: { id: string; name: string };
  shop: { id: string; name: string };
};

const FlashSaleProductCard = ({ product }: { product: TFlashProduct }) => {
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const user = useAuthStore((s) => s.user);

  const { data: cartData, refetch: refetchCart } = useFetchData<{ id: string; vendorId: string }>(
    ["userCart"],
    "/cart/my-cart",
    { enabled: user?.userRole === "CUSTOMER" }
  );

  const { mutateAsync: addToCartMutate, isPending: addingCart } = usePost([["userCart"]]);
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
        toast.error(err?.response?.data?.message || "Failed", { id: toastId, duration: 1400 });
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

  const discountPct = ((product.discount / product.price) * 100).toFixed(2);

  return (
    <Card className="bg-white border border-gray-300 hover:shadow-md transition-all duration-300 overflow-hidden">
      <CartItemReplaceModal
        showReplaceModal={showReplaceModal}
        setShowReplaceModal={setShowReplaceModal}
        handleReplaceCart={handleReplaceCart}
      />
      <Link href={`/product/${product.id}`}>
        <div className="relative h-[15rem]">
          <Image
            src={product.productImg || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="320px"
          />
          <Badge className="absolute top-3 left-3 bg-red-600 hover:bg-red-700 text-white font-bold">
            -{discountPct}%
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="text-black font-semibold text-lg">{product.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold text-green-600">
              ${product.price - product.discount}
            </span>
            <span className="text-gray-400 line-through text-sm">
              ${product.price}
            </span>
          </div>
        </CardContent>
      </Link>
      <div className="pb-2 px-2 flex justify-center">
        <Button
          size="sm"
          disabled={addingCart}
          onClick={handleAddCart}
          className="w-full text-sm font-semibold text-white bg-prime100 hover:bg-prime200"
        >
          <IoMdCart />
          <span>{addingCart ? "Adding…" : "Add To Cart"}</span>
        </Button>
      </div>
    </Card>
  );
};

export default FlashSaleProductCard;
