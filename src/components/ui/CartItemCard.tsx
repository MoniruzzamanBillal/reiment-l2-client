const CartItemCard = ({
  item,
  handleAddQuantity,
  handleReduceQuantity,
  handleDeleteCartItem,
}) => {
  // console.log(item);
  //   console.log(item?.product);

  return (
    <div className=" bg-white border border-gray-300 my-4 py-2 sm:py-4 px-5  flex justify-between items-center rounded-md ">
      {/* product name image section  */}
      <div className="productNameImg flex gap-x-2  w-[50%] ">
        {/* product img  */}
        <div className=" imgContainer group relative block size-[5.6rem] overflow-hidden rounded-lg bg-gray-100  ">
          <img
            src={item?.product?.productImg}
            alt="product image "
            className="h-full w-full object-fit object-center transition duration-200 group-hover:scale-110"
          />
        </div>

        {/* prod name  */}
        <div className="prodName text-lg font-medium   ">
          <p> {item?.product?.name}</p>
        </div>
      </div>

      {/* quantity section  */}
      <div className="cartQuantity flex items-center  w-[20%] ">
        <div className="decBtn text-xl font-semibold">
          <button
            onClick={() => handleReduceQuantity(item)}
            className="flex w-6 flex-1 select-none items-center justify-center bg-white leading-none transition duration-100 hover:bg-gray-100 active:bg-gray-200"
          >
            -
          </button>
        </div>

        <p className="  border border-gray-300 py-1  px-3  ring-inset ring-indigo-300 transition duration-100 focus:ring">
          {item?.quantity}
        </p>

        <div className="incBtn text-xl font-semibold ">
          <button
            onClick={() => handleAddQuantity(item)}
            className="flex w-6 flex-1 select-none items-center justify-center bg-white leading-none transition duration-100 hover:bg-gray-100 active:bg-gray-200"
          >
            +
          </button>
        </div>
      </div>

      {/* price section  */}

      <div className="priceSection w-[20%] ml-4 pt-3 sm:pt-2 md:ml-8 lg:ml-16">
        <span className="block font-bold text-gray-800 md:text-lg">
          $ {item?.price * item?.quantity}
        </span>
      </div>

      {/* delete action section starts  */}
      <div className="deleteBtn">
        <button
          className="select-none text-sm font-semibold text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700"
          onClick={() => handleDeleteCartItem(item)}
        >
          Delete
        </button>
      </div>

      {/*  */}
    </div>
  );
};

export default CartItemCard;
