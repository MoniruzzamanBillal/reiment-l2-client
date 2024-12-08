const CartItemCard = ({
  item,
  handleAddQuantity,
  handleReduceQuantity,
  handleDeleteCartItem,
}) => {
  //   console.log(item);
  //   console.log(item?.product);

  return (
    <div className=" bg-white border border-gray-200 my-4 py-2 sm:py-4 px-5 rounded-md shadow-md  ">
      <div className="flex flex-wrap gap-4 sm:py-2.5 lg:gap-6">
        {/* product image section starts  */}
        <div className="sm:-my-2.5">
          <div className=" imgContainer group relative block h-40 w-24 overflow-hidden rounded-lg bg-gray-100 sm:h-56 sm:w-40">
            <img
              src={item?.product?.productImg}
              loading="lazy"
              alt="product image "
              className="h-full w-full object-fit object-center transition duration-200 group-hover:scale-110"
            />
          </div>
        </div>
        {/* product image section ends  */}

        {/* product detail section starts */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <p className="mb-1 inline-block text-lg font-bold text-gray-800 transition duration-100 hover:text-gray-500 lg:text-xl">
              {item?.product?.name}
            </p>
          </div>

          <div>
            <span className="mb-1 block font-bold text-gray-800 md:text-lg">
              $ {item?.price}
            </span>
          </div>
        </div>
        {/* product detail section starts */}

        {/* right section starts  */}
        <div className="  flex w-full justify-between border-t pt-4 sm:w-auto sm:border-none sm:pt-0">
          <div className="flex flex-col items-start gap-2">
            <div className="flex justify-between  h-12 w-20 overflow-hidden rounded border">
              {/* product quantity starts  */}
              <div className=" w-[70%]  cartContent flex justify-center items-center ">
                <p className="    ring-inset ring-indigo-300 transition duration-100 focus:ring">
                  {item?.quantity}
                </p>
              </div>
              {/* product quantity ends   */}

              {/* button section starts  */}

              <div className=" w-[30%] flex flex-col divide-y border-l">
                <button
                  onClick={() => handleAddQuantity(item)}
                  className="flex w-6 flex-1 select-none items-center justify-center bg-white leading-none transition duration-100 hover:bg-gray-100 active:bg-gray-200"
                >
                  +
                </button>

                <button
                  onClick={() => handleReduceQuantity(item)}
                  className="flex w-6 flex-1 select-none items-center justify-center bg-white leading-none transition duration-100 hover:bg-gray-100 active:bg-gray-200"
                >
                  -
                </button>
              </div>
              {/* button section ends  */}
            </div>

            <button
              className="select-none text-sm font-semibold text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700"
              onClick={() => handleDeleteCartItem(item)}
            >
              Delete
            </button>
          </div>

          {/* product price starts  */}
          <div className="ml-4 pt-3 sm:pt-2 md:ml-8 lg:ml-16">
            <span className="block font-bold text-gray-800 md:text-lg">
              $ {item?.price * item?.quantity}
            </span>
          </div>
          {/* product price ends */}
        </div>
        {/* right section ends   */}

        {/*  */}
      </div>
    </div>
  );
};

export default CartItemCard;
