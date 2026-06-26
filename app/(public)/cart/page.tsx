"use client";

import CartItemCard from "@/components/shared/cards/CartItemCard";
import FormSubmitLoading from "@/components/shared/FormSubmitLoading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFetchData, useDeleteData, usePatch, usePost } from "@/hooks/useApi";
import { useCouponStore } from "@/stores/useCouponStore";
import { TCart, TCartItem } from "@/types";
import { calculateCartPrice } from "@/utils/calculateCartPrice";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const CartPage = () => {
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const { couponId, setCouponId, resetCoupon } = useCouponStore();

  const {
    data: cartData,
    isLoading: cartLoading,
    refetch: refetchCart,
  } = useFetchData<TCart>(["userCart"], "/cart/my-cart");

  const cart: TCart | null = (cartData as any)?.data ?? null;

  const { mutateAsync: increaseMutate, isPending: increasePending } = usePatch([
    ["userCart"],
  ]);
  const { mutateAsync: decreaseMutate, isPending: decreasePending } = usePatch([
    ["userCart"],
  ]);
  const { mutateAsync: deleteMutate, isPending: deletePending } = useDeleteData([
    ["userCart"],
  ]);
  const { mutateAsync: couponMutate } = usePost([]);
  const { mutateAsync: orderMutate, isPending: orderPending } = usePost([
    ["userCart"],
  ]);

  const totalCartPrice = calculateCartPrice(cart?.cartItem);

  const handleAddQuantity = async (item: TCartItem) => {
    const toastId = toast.loading("Adding quantity…");
    try {
      const result: any = await increaseMutate({
        url: "/cart/increase-item-quantity",
        payload: { productId: item.productId, quantity: 1 },
      });
      if (result?.data?.success) {
        refetchCart();
        toast.success(result.data.message, { id: toastId, duration: 1500 });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed", {
        id: toastId,
        duration: 1400,
      });
    }
  };

  const handleReduceQuantity = async (item: TCartItem) => {
    if (item.quantity <= 1) return;
    const toastId = toast.loading("Decreasing quantity…");
    try {
      const result: any = await decreaseMutate({
        url: "/cart/decrease-item-quantity",
        payload: { productId: item.productId, quantity: 1 },
      });
      if (result?.data?.success) {
        refetchCart();
        toast.success(result.data.message, { id: toastId, duration: 1500 });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed", {
        id: toastId,
        duration: 1400,
      });
    }
  };

  const handleDeleteCartItem = async (item: TCartItem) => {
    const toastId = toast.loading("Deleting item…");
    try {
      const result: any = await deleteMutate({
        url: `/cart/delete-cart-item?cartId=${item.cartId}&cartItemId=${item.id}`,
      });
      if (result?.data?.success) {
        refetchCart();
        toast.success(result.data.message, { id: toastId, duration: 1500 });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed", {
        id: toastId,
        duration: 1400,
      });
    }
  };

  const handleApplyCoupon = async () => {
    if (!coupon) { toast.error("Please enter a coupon code!"); return; }
    try {
      const result: any = await couponMutate({
        url: "/coupon/get-coupon",
        payload: { coupon },
      });
      if (result?.data?.success) {
        toast.success("Coupon applied successfully!!", { duration: 1600 });
        setCouponId(result.data.data.id);
        setDiscount(result.data.data.discountValue);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid coupon", {
        duration: 1800,
      });
      setCoupon("");
      resetCoupon();
    }
  };

  const handleOrderItem = async () => {
    const toastId = toast.loading("Placing order…");
    try {
      const result: any = await orderMutate({
        url: "/order/order-item",
        payload: { cartId: cart?.id, couponId },
      });
      if (result?.data) {
        toast.success(result.data.message, { id: toastId, duration: 2000 });
        resetCoupon();
        const paymentUrl = result.data.data;
        if (paymentUrl) window.location.href = paymentUrl;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed", {
        id: toastId,
        duration: 1400,
      });
    }
  };

  const isLoading =
    cartLoading || increasePending || decreasePending || deletePending;

  return (
    <>
      {isLoading && <FormSubmitLoading />}

      <div className="ProductCartContainer">
        <div className="bg-gray-100 pt-16 pb-8">
          <div className="mx-auto max-w-screen-lg px-4 md:px-8">
            <div className="mb-8">
              <h1 className="text-center font-semibold text-prime200 text-lg xsm:text-xl sm:text-3xl md:text-3xl xl:text-4xl">
                Your Cart
              </h1>
            </div>

            <div className="mb-5 sm:mb-8 flex flex-col sm:divide-y sm:border-t sm:border-b">
              {!cart || cart.cartItem?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-y-4">
                  <p className="text-2xl font-bold text-prime100">
                    Your cart is empty
                  </p>
                  <Link href="/products">
                    <Button className="bg-prime100 hover:bg-prime200">
                      Browse Products
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="cartItemRender p-3 bg-white shadow-md rounded-md border border-gray-300">
                  {cart.cartItem.map((item: TCartItem) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      handleAddQuantity={handleAddQuantity}
                      handleReduceQuantity={handleReduceQuantity}
                      handleDeleteCartItem={handleDeleteCartItem}
                    />
                  ))}
                </div>
              )}
            </div>

            {cart && cart.cartItem?.length > 0 && (
              <div className="flex flex-col items-end gap-4">
                <div className="w-full bg-white border border-gray-200 rounded-md shadow-md p-4 sm:max-w-xs">
                  <div className="py-2">
                    <div className="flex py-1 justify-between gap-4 text-gray-900">
                      <span className="font-medium">Subtotal</span>
                      <span>$ {(totalCartPrice - discount).toFixed(2)}</span>
                    </div>
                    <div className="flex py-1 justify-between gap-4 text-gray-700">
                      <span className="font-medium">Shipping</span>
                      <span>$4.99</span>
                    </div>
                  </div>

                  <div className="mt-4 text-sm flex items-center">
                    <Input
                      placeholder="Enter Promo Code"
                      className="rounded-none text-sm"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      className="rounded-none text-sm"
                    >
                      Apply
                    </Button>
                  </div>

                  <div className="mt-4 border-t pt-4">
                    <div className="flex items-start justify-between gap-4 text-gray-800">
                      <span className="text-lg font-bold">Total</span>
                      <span className="flex flex-col items-end">
                        <span className="text-lg font-bold">
                          {(totalCartPrice + 4.99 - discount).toFixed(2)} USD
                        </span>
                        <span className="text-sm text-gray-500">
                          including VAT
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  disabled={orderPending}
                  className="text-sm font-medium text-white transition duration-100 bg-prime50 hover:bg-prime100"
                  onClick={handleOrderItem}
                >
                  {orderPending ? "Ordering…" : "Order Item"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
