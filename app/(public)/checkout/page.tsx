"use client";

import FormSubmitLoading from "@/components/shared/FormSubmitLoading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFetchData, usePost } from "@/hooks/useApi";
import { useCouponStore } from "@/stores/useCouponStore";
import { TCart } from "@/types";
import { calculateCartPrice } from "@/utils/calculateCartPrice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const checkoutSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
});

type TCheckoutForm = z.infer<typeof checkoutSchema>;

const SHIPPING = 4.99;

const CheckoutPage = () => {
  const { couponId, setCouponId, resetCoupon } = useCouponStore();

  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");

  const { data: cartData, isLoading: cartLoading } = useFetchData<TCart>(
    ["userCart"],
    "/cart/my-cart"
  );
  const cart: TCart | null = (cartData as any)?.data ?? null;

  const subtotal = calculateCartPrice(cart?.cartItem);

  const { mutateAsync: couponMutate, isPending: couponPending } = usePost([]);
  const { mutateAsync: orderMutate, isPending: orderPending } = usePost([
    ["userCart"],
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TCheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  const handleApplyCoupon = async () => {
    setCouponError("");
    if (!code) {
      toast.error("Please enter a coupon code!");
      return;
    }
    try {
      const result: any = await couponMutate({
        url: "/coupon/apply-coupon",
        payload: { code },
      });
      if (result?.success) {
        toast.success("Coupon applied successfully!!", { duration: 1600 });
        setCouponId(result.data.id);
        setDiscount(result.data.discountValue);
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || "Invalid coupon";
      setCouponError(message);
      toast.error(message, { duration: 1800 });
      setDiscount(0);
      resetCoupon();
    }
  };

  const onSubmit = async (_data: TCheckoutForm) => {
    const toastId = toast.loading("Placing order…");
    try {
      const result: any = await orderMutate({
        url: "/order/order-item",
        payload: { cartId: cart?.id, couponId },
      });
      if (result?.success) {
        toast.success(result.message, { id: toastId, duration: 2000 });
        resetCoupon();
        setCode("");
        setDiscount(0);
        setCouponError("");
        const paymentUrl = result.data;
        if (paymentUrl) window.location.href = paymentUrl;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to place order", {
        id: toastId,
        duration: 1400,
      });
    }
  };

  return (
    <>
      {(cartLoading || orderPending) && <FormSubmitLoading />}

      <div className="CheckoutContainer pt-16 pb-8 bg-gray-100 min-h-screen p-3 shadow rounded-md">
        <div className="CheckoutWrapper">
          <h1 className="mb-8 px-3 xsm:px-4 sm:px-5 md:px-6 font-bold text-2xl md:text-3xl text-center">
            Checkout
          </h1>

          <div className="p-1 w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[70%] xmd:w-[65%] lg:w-[55%] m-auto flex flex-col gap-y-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="checkoutForm flex flex-col gap-y-4"
            >
              <div className="flex flex-col gap-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Street Address :
                </label>
                <Input
                  type="text"
                  placeholder="Enter your street address"
                  {...register("street")}
                />
                {errors.street && (
                  <p className="text-red-500 text-xs">{errors.street.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-y-1">
                <label className="text-sm font-medium text-gray-700">City :</label>
                <Input
                  type="text"
                  placeholder="Enter your city"
                  {...register("city")}
                />
                {errors.city && (
                  <p className="text-red-500 text-xs">{errors.city.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Postal Code :
                </label>
                <Input
                  type="text"
                  placeholder="Enter your postal code"
                  {...register("postalCode")}
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-xs">
                    {errors.postalCode.message}
                  </p>
                )}
              </div>

              <div className="w-full bg-white border border-gray-200 rounded-md shadow-md p-4 mt-2">
                <div className="mb-1">
                  <label className="text-sm font-medium text-gray-700">
                    Promo Code :
                  </label>
                </div>
                <div className="text-sm flex items-center">
                  <Input
                    placeholder="Enter Promo Code"
                    className="rounded-none text-sm"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <Button
                    type="button"
                    disabled={couponPending}
                    onClick={handleApplyCoupon}
                    className="rounded-none text-sm"
                  >
                    {couponPending ? "Applying…" : "Apply"}
                  </Button>
                </div>
                {couponError && (
                  <p className="text-red-500 text-xs mt-1">{couponError}</p>
                )}

                <div className="mt-4 py-2 border-t">
                  <div className="flex py-1 justify-between gap-4 text-gray-900">
                    <span className="font-medium">Subtotal</span>
                    <span>$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex py-1 justify-between gap-4 text-gray-700">
                    <span className="font-medium">Shipping</span>
                    <span>$ {SHIPPING.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex py-1 justify-between gap-4 text-green-700">
                      <span className="font-medium">Discount</span>
                      <span>- $ {discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="mt-2 border-t pt-4">
                  <div className="flex items-start justify-between gap-4 text-gray-800">
                    <span className="text-lg font-bold">Total</span>
                    <span className="flex flex-col items-end">
                      <span className="text-lg font-bold">
                        {(subtotal + SHIPPING - discount).toFixed(2)} USD
                      </span>
                      <span className="text-sm text-gray-500">
                        including VAT
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={orderPending}
                className="font-semibold text-sm active:scale-95 duration-500 bg-prime50 hover:bg-prime100"
              >
                Place Order
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
