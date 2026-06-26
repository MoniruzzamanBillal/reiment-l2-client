import Link from "next/link";

const NoCartItem = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-gray-500">
      <p className="text-lg font-medium">Your cart is empty</p>
      <Link
        href="/products"
        className="px-6 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors"
      >
        Browse Products
      </Link>
    </div>
  );
};

export default NoCartItem;
