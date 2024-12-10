import { CartItemCard, FormSubmitLoading, NoCartItem } from "@/components/ui";
import {
  useDecreaseCartItemQuantityMutation,
  useGetUserCartQuery,
  useIncreaseCartItemQuantityMutation,
} from "@/redux/features/cart/cart.api";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const UserCart = () => {
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

  // console.log(cartData?.data?.cartItem);

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
    console.log(item);
  };

  useEffect(() => {
    refetchCart();
  }, [
    cartItemAddingLoading,
    refetchCart,
    cartData?.data?.cartItem,
    decreaseCartLoading,
  ]);

  return (
    <>
      {(cartDataLoading || cartItemAddingLoading || decreaseCartLoading) && (
        <FormSubmitLoading />
      )}

      <div className="ProductCartContainer">
        <div className="ProductCartWrapper   bg-gray-100 py-6 sm:py-8 lg:py-12">
          <div className="mx-auto max-w-screen-lg px-4 md:px-8">
            <div className="mb-8 ">
              <h1 className="  text-center font-semibold text-indigo-500 text-lg xsm:text-xl sm:text-3xl md:text-3xl xl:text-4xl text-shadow-blue">
                Your Cart
              </h1>
            </div>

            <div className="mb-5 flex flex-col sm:mb-8 sm:divide-y sm:border-t sm:border-b">
              {/* product - start  */}

              {cartData?.data?.cartItem?.length === 0 ? (
                <NoCartItem />
              ) : (
                cartData?.data?.cartItem &&
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
                ))
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
                  <div className="space-y-1">
                    <div className="flex justify-between gap-4 text-gray-900">
                      <span>Subtotal</span>
                      <span>$totalPrice</span>
                    </div>

                    <div className="flex justify-between gap-4 text-gray-700">
                      <span>Shipping</span>
                      <span>$4.99</span>
                    </div>
                  </div>

                  <div className="mt-4 border-t pt-4">
                    <div className="flex items-start justify-between gap-4 text-gray-800">
                      <span className="text-lg font-bold">Total</span>

                      <span className="flex flex-col items-end">
                        <span className="text-lg font-bold">
                          $ totalPrice + 4.99 USD
                        </span>
                        <span className="text-sm text-gray-500">
                          including VAT
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                {/* price card ends   */}

                <button
                  className="inline-block rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base"
                  onClick={() => navigate("/checkout")}
                >
                  Check out
                </button>
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
