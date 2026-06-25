"use client";

import FormSubmitLoading from "@/components/shared/FormSubmitLoading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFetchData, usePost } from "@/hooks/useApi";
import { useCouponStore } from "@/stores/useCouponStore";
import { TCart } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const checkoutSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
});

type TCheckoutForm = z.infer<typeof checkoutSchema>;

const CheckoutPage = () => {
  const { couponId, resetCoupon } = useCouponStore();

  const { data: cartData, isLoading: cartLoading } = useFetchData<TCart>(
    ["userCart"],
    "/cart/my-cart"
  );
  const cart: TCart | null = (cartData as any)?.data ?? null;

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

  const onSubmit = async (_data: TCheckoutForm) => {
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

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="checkoutForm p-1 w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[70%] xmd:w-[65%] lg:w-[55%] m-auto flex flex-col gap-y-4"
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
    </>
  );
};

export default CheckoutPage;
