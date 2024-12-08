import { CartItemCard, FormSubmitLoading, NoCartItem } from "@/components/ui";
import { useGetUserCartQuery } from "@/redux/features/cart/cart.api";

const UserCart = () => {
  const { data: cartData, isLoading: cartDataLoading } =
    useGetUserCartQuery(undefined);

  //   console.log(cartData?.data?.cartItem);

  //   ! function for adding cart quantity
  const handleAddQuantity = async (item) => {
    console.log(item);
  };

  // ! function for reducing cart quantity
  const handleReduceQuantity = async (item) => {
    console.log(item);
  };

  // ! function for deleting cart item
  const handleDeleteCartItem = async (item) => {
    console.log(item);
  };

  return (
    <>
      {cartDataLoading && <FormSubmitLoading />}

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
                  //   onClick={() => handleCheckout()}
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
