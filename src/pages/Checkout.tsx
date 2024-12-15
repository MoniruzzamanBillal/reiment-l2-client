import { z } from "zod";
import { ReimentForm, ReimentInput } from "@/components/form";
import { Button } from "@/components/ui/button";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { FormSubmitLoading } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetUserCartQuery } from "@/redux/features/cart/cart.api";
import { useOrderItemMutation } from "@/redux/features/order/order.api";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { resetCoupon } from "@/redux/features/cupon/cupon.slice";

const Checkout = () => {
  const dispatch = useAppDispatch();
  const { cuponId } = useAppSelector((state) => state?.coupon);

  const { data: cartData, isLoading: cartDataLoading } =
    useGetUserCartQuery(undefined);

  const [orderItem, { isLoading }] = useOrderItemMutation();

  console.log(cuponId);

  const handleAddAddress = async (data: FieldValues) => {
    const taostId = toast.loading("Placing order ....");

    console.log(data);

    const payload = {
      cartId: cartData?.data?.id,
      cuponId,
    };

    try {
      const result = await orderItem(payload);

      if (result?.error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessage = (result?.error as any)?.data?.message;
        toast.error(errorMessage, {
          id: taostId,
          duration: 1400,
        });
      }

      if (result?.data) {
        const successMsg = result?.data?.message;
        const paymentUrl = result?.data?.data;

        toast.success(successMsg, {
          id: taostId,
          duration: 2000,
        });
        dispatch(resetCoupon());
        window.location.href = paymentUrl;
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong !!!", { id: taostId, duration: 1400 });
    }
  };

  return (
    <>
      {(cartDataLoading || isLoading) && <FormSubmitLoading />}

      <div className="CheckoutContainer py-8 bg-gray-100 min-h-screen p-3 shadow rounded-md">
        <div className="CheckoutWrapper">
          <h1 className="mb-8 px-3 xsm:px-4 sm:px-5 md:px-6 font-bold text-2xl md:text-3xl text-center">
            Checkout
          </h1>

          <div className="checkoutForm p-1 w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[70%] xmd:w-[65%] lg:w-[55%] m-auto">
            <ReimentForm
              onSubmit={handleAddAddress}
              resolver={zodResolver(
                z.object({
                  street: z.string().min(1, "Street name is required !!"),
                  city: z.string().min(1, "Street name is required !!"),
                  postalCode: z.string().min(1, "Street name is required !!"),
                })
              )}
            >
              <ReimentInput
                type="text"
                label="Street Address :"
                name="street"
                placeholder="Enter your street address"
              />

              <ReimentInput
                type="text"
                label="City :"
                name="city"
                placeholder="Enter your city"
              />

              <ReimentInput
                type="text"
                label="Postal Code :"
                name="postalCode"
                placeholder="Enter your postal code"
              />

              <Button
                className={`px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base active:scale-95 duration-500 bg-prime50 hover:bg-prime100`}
              >
                Place Order
              </Button>
            </ReimentForm>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
