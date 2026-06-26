"use client";

import { TCartItem } from "@/types";
import Image from "next/image";

type TProps = {
  item: TCartItem;
  handleAddQuantity: (item: TCartItem) => void;
  handleReduceQuantity: (item: TCartItem) => void;
  handleDeleteCartItem: (item: TCartItem) => void;
};

const CartItemCard = ({
  item,
  handleAddQuantity,
  handleReduceQuantity,
  handleDeleteCartItem,
}: TProps) => {
  return (
    <div className="bg-white border border-gray-300 my-4 py-2 sm:py-4 px-5 flex justify-between items-center rounded-md">
      <div className="productNameImg flex gap-x-2 w-[50%]">
        <div className="imgContainer group relative block size-[5.6rem] overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={item.product?.productImg || "/placeholder.svg"}
            alt={item.product?.name ?? "product"}
            fill
            className="object-cover transition duration-200 group-hover:scale-110"
            sizes="90px"
          />
        </div>
        <div className="prodName text-lg font-medium">
          <p>{item.product?.name}</p>
        </div>
      </div>

      <div className="cartQuantity flex items-center w-[20%]">
        <button
          onClick={() => handleReduceQuantity(item)}
          className="flex w-6 flex-1 select-none items-center justify-center bg-white leading-none transition duration-100 hover:bg-gray-100 active:bg-gray-200 text-xl font-semibold"
        >
          -
        </button>
        <p className="border border-gray-300 py-1 px-3">{item.quantity}</p>
        <button
          onClick={() => handleAddQuantity(item)}
          className="flex w-6 flex-1 select-none items-center justify-center bg-white leading-none transition duration-100 hover:bg-gray-100 active:bg-gray-200 text-xl font-semibold"
        >
          +
        </button>
      </div>

      <div className="priceSection w-[20%] ml-4 pt-3 sm:pt-2 md:ml-8 lg:ml-16">
        <span className="block font-bold text-gray-800 md:text-lg">
          ${item.price * item.quantity}
        </span>
      </div>

      <div className="deleteBtn">
        <button
          className="select-none text-sm font-semibold text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700"
          onClick={() => handleDeleteCartItem(item)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;
