import { CartItemCard, FormSubmitLoading, NoCartItem } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useDecreaseCartItemQuantityMutation,
  useDeleteCartItemMutation,
  useGetUserCartQuery,
  useIncreaseCartItemQuantityMutation,
} from "@/redux/features/cart/cart.api";
import { useGetCouponMutation } from "@/redux/features/cupon/coupon.api";
import { calculateCartPrice } from "@/utils/CalculateCartPrice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { resetCoupon, setCouponId } from "@/redux/features/cupon/cupon.slice";
import { useAppDispatch } from "@/redux/hook";

const UserCart = () => {
  const dispatch = useAppDispatch();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const navigate = useNavigate();
  const {
    data: cartData,
    isLoading: cartDataLoading,
    refetch: refetchCart,
  } = useGetUserCartQuery(undefined);

  const [increaseCartItemQuantity, { isLoading: cartItemAddingLoading }] =
    useIncreaseCartItemQuantityMutation();

  const [decreaseCartItemQuantity, { isLoading: decreaseCartLoading }] =
    useDecreaseCartItemQuantityMutation();

  const [deleteCartItem, { isLoading: deleteCartItemLoading }] =
    useDeleteCartItemMutation();

  const [getCoupon, { isLoading: couponRetrivingLoading }] =
    useGetCouponMutation();

  // console.log(cartData?.data?.cartItem);
  // console.log(cartData?.data);

  const totalCartPrice = calculateCartPrice(cartData?.data?.cartItem);

  //   ! function for adding cart quantity
  const handleAddQuantity = async (item) => {
    const payload = {
      productId: item?.productId,
      quantity: 1,
    };

    try {
      const toastId = toast.loading("Adding to cart quantity!! ");

      const result = await increaseCartItemQuantity(payload);

      //  *  for any  error
      if (result?.error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessage = (result?.error as any)?.data?.message;
        toast.error(errorMessage, {
          duration: 1400,
          id: toastId,
        });
      }

      if (result?.data?.success) {
        toast.success(result?.data?.message, { duration: 1500, id: toastId });
        refetchCart();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong !!!", { duration: 1200 });
    }
  };

  // ! function for reducing cart quantity
  const handleReduceQuantity = async (item) => {
    if (item?.quantity <= 1) {
      return;
    }

    const payload = {
      productId: item?.productId,
      quantity: 1,
    };

    try {
      const toastId = toast.loading("Decreaseing cart quantity!! ");
      const result = await decreaseCartItemQuantity(payload);
      //  *  for any  error
      if (result?.error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessage = (result?.error as any)?.data?.message;
        toast.error(errorMessage, {
          duration: 1400,
          id: toastId,
        });
      }
      if (result?.data?.success) {
        toast.success(result?.data?.message, { duration: 1500, id: toastId });
        refetchCart();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong !!!", { duration: 1200 });
    }
  };

  // ! function for deleting cart item
  const handleDeleteCartItem = async (item) => {
    const payload = {
      cartId: item?.cartId,
      cartItemId: item?.id,
    };

    try {
      const toastId = toast.loading("Deleting Cart Item!!");

      const result = await deleteCartItem(payload);

      //  *  for any  error
      if (result?.error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessage = (result?.error as any)?.data?.message;
        toast.error(errorMessage, {
          duration: 1400,
          id: toastId,
        });
      }

      if (result?.data?.success) {
        toast.success(result?.data?.message, { duration: 1500, id: toastId });
        refetchCart();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong !!!", { duration: 1200 });
    }
  };

  const handleApplyCoupon = async () => {
    if (!coupon) {
      toast.error("Please enter a coupon code!");
      return;
    }

    try {
      const result = await getCoupon({ coupon });

      //  *  for any  error
      if (result?.error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessage = (result?.error as any)?.data?.message;
        console.log(errorMessage);
        toast.error(errorMessage, {
          duration: 1800,
        });
        setCoupon("");
        dispatch(resetCoupon());
      }

      // * for successful insertion
      if (result?.data?.success) {
        toast.success("Coupon applied successfully !!", { duration: 1600 });
        const cuponId = result?.data?.data?.id;
        dispatch(setCouponId(cuponId));

        setDiscount(result?.data?.data?.discountValue);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while applying coupon !!!", {
        duration: 1400,
      });
    }

    //
  };

  useEffect(() => {
    refetchCart();
  }, [
    cartItemAddingLoading,
    refetchCart,
    cartData?.data?.cartItem,
    decreaseCartLoading,
    deleteCartItemLoading,
  ]);

  return (
    <>
      {(cartDataLoading ||
        cartItemAddingLoading ||
        decreaseCartLoading ||
        deleteCartItemLoading) && <FormSubmitLoading />}

      <div className="ProductCartContainer">
        <div className="ProductCartWrapper   bg-gray-100 py-6 sm:py-8 lg:py-12">
          <div className="mx-auto max-w-screen-lg px-4 md:px-8">
            <div className="mb-8 ">
              <h1 className="  text-center font-semibold text-indigo-500 text-lg xsm:text-xl sm:text-3xl md:text-3xl xl:text-4xl text-shadow-blue">
                Your Cart
              </h1>
            </div>

            <div className="mb-5 sm:mb-8 flex flex-col  sm:divide-y sm:border-t sm:border-b">
              {/* product - start  */}

              {!cartData?.data || cartData?.data?.cartItem?.length === 0 ? (
                <NoCartItem />
              ) : (
                <div className="cartItemRender p-3  bg-white shadow-md rounded-md border border-gray-300 ">
                  {cartData?.data?.cartItem &&
                    cartData?.data?.cartItem?.map((item) => (
                      // cart item card
                      <CartItemCard
                        key={item?.id}
                        item={item}
                        handleAddQuantity={handleAddQuantity}
                        handleReduceQuantity={handleReduceQuantity}
                        handleDeleteCartItem={handleDeleteCartItem}
                      />
                      // cart item card
                    ))}
                </div>
              )}
            </div>

            {/* bottom section strts  */}
            {/* totals - start  */}
            {cartData?.data?.length === 0 ? (
              ""
            ) : (
              <div className="flex flex-col items-end gap-4  ">
                {/* price card starts  */}
                <div className="w-full  bg-white border border-gray-200 rounded-md shadow-md p-4 sm:max-w-xs">
                  <div className=" py-2 ">
                    <div className="flex py-1 justify-between gap-4 text-gray-900">
                      <span className=" font-medium ">Subtotal</span>
                      <span>$ {totalCartPrice - discount} </span>
                    </div>

                    <div className="flex  py-1 justify-between gap-4 text-gray-700">
                      <span className=" font-medium ">Shipping</span>
                      <span>$4.99</span>
                    </div>
                  </div>

                  <div className="promocodeSection mt-4  text-sm flex  items-center  ">
                    <Input
                      placeholder="Enter Promo Code"
                      className="  rounded-none text-sm "
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                    />
                    <Button
                      onClick={() => handleApplyCoupon()}
                      className="  rounded-none text-sm "
                    >
                      {" "}
                      Apply{" "}
                    </Button>
                  </div>

                  <div className="mt-4 border-t pt-4">
                    <div className="flex items-start justify-between gap-4 text-gray-800">
                      <span className="text-lg font-bold">Total</span>

                      <span className="flex flex-col items-end">
                        <span className="text-lg font-bold">
                          {totalCartPrice + 4.99 - discount} USD
                        </span>
                        <span className="text-sm text-gray-500">
                          including VAT
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                {/* price card ends   */}

                <Button
                  className="  text-sm font-medium text-white  transition duration-100 bg-prime50 hover:bg-prime100 "
                  onClick={() => navigate("/checkout")}
                >
                  Check out
                </Button>
              </div>
            )}

            {/* totals - end  */}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserCart;
