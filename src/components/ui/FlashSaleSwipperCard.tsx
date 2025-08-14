import {
  useAddProductToCartMutation,
  useGetUserCartQuery,
  useReplaceCartMutation,
} from "@/redux/features/cart/cart.api";
import { useState } from "react";
import { IoMdCart } from "react-icons/io";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "./badge";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import CartItemReplaceModal from "./CartItemReplaceModal";

type Category = {
  id: string;
  name: string;
  categoryImg: string;
  isDelated: boolean;
  createdAt: string;
  updatedAt: string;
};

type Shop = {
  id: string;
  vendorId: string;
  name: string;
  logo: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

type TProduct = {
  id: string;
  shopId: string;
  categoryId: string;
  name: string;
  price: number;
  discount: number;
  inventoryCount: number;
  description: string;
  productImg: string;
  isDelated: boolean;
  createdAt: string;
  updatedAt: string;
  category: Category;
  shop: Shop;
};

const FlashSaleSwipperCard = ({ product }: { product: TProduct }) => {
  const [showReplaceModal, setShowReplaceModal] = useState(false);

  const { data: userCardData, refetch: refetchCart } =
    useGetUserCartQuery(undefined);

  const [addProductToCart, { isLoading: addingCartLoading }] =
    useAddProductToCartMutation();

  const [replaceCart] = useReplaceCartMutation();

  // ! for adding item to cart
  const handleAddCart = async (product: TProduct) => {
    if (
      !userCardData?.data ||
      product?.shopId === userCardData?.data?.vendorId
    ) {
      const toastId = toast.loading("Adding to cart ");

      const payload = {
        productId: product?.id,
        quantity: 1,
      };

      const result = await addProductToCart(payload);

      //  *  for any  error
      if (result?.error) {
        const errorMessage = (result?.error as any)?.data?.message;

        toast.error(errorMessage, {
          duration: 1400,
          id: toastId,
        });
      }

      if (result?.data?.success) {
        refetchCart();
        toast.success(result?.data?.message, { duration: 1500, id: toastId });
      }
    } else {
      setShowReplaceModal(true);
    }
  };

  // ! for replacing cart
  const handleReplaceCart = async () => {
    const payload = {
      cartId: userCardData?.data?.id,
      productId: product?.id,
      quantity: 1,
    };

    const result = await replaceCart(payload);

    //  *  for any  error
    if (result?.error) {
      const errorMessage = (result?.error as any)?.data?.message;

      toast.error(errorMessage, {
        duration: 1400,
      });
    }
    if (result?.data?.success) {
      refetchCart();
      toast.success(result?.data?.message, { duration: 1600 });
      setShowReplaceModal(false);
    }
  };

  console.log(product);

  return (
    <Card className="bg-white backdrop-blur-md border border-gray-300 hover:bg-white/7s0 transition-all duration-300 overflow-hidden ">
      {/* Cart replace modal  */}
      <CartItemReplaceModal
        showReplaceModal={showReplaceModal}
        setShowReplaceModal={setShowReplaceModal}
        handleReplaceCart={handleReplaceCart}
      />

      <Link className="    " to={`/product/detail/${product?.id}`}>
        <div className="relative h-[15rem]  ">
          <img
            src={product?.productImg || "/placeholder.svg"}
            alt={product?.name}
            className="w-full h-full object-cover"
          />
          <Badge className="absolute top-3 left-3 bg-red-600 hover:bg-red-700 text-white font-bold">
            -{((product?.discount / product?.price) * 100).toFixed(2)} %
          </Badge>
        </div>

        <CardContent className="p-4">
          <h3 className="text-black font-semibold text-lg  ">
            {product?.name}
          </h3>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold text-green-600">
              ${product?.price - product?.discount}
            </span>
            <span className="text-gray-400 line-through text-sm">
              ${product?.price}
            </span>
          </div>
        </CardContent>
      </Link>

      <div className="buttonSectio pb-2 px-2  mx-auto   flex justify-center items-center  ">
        <Button
          size={"sm"}
          disabled={addingCartLoading}
          onClick={() => handleAddCart(product)}
          className="  mx-auto  w-full text-center text-sm font-semibold text-white transition duration-100  bg-prime100 hover:bg-prime200 "
        >
          <span>
            <IoMdCart />
          </span>
          <span>{addingCartLoading ? "Adding to cart" : "Add To Cart"} </span>
        </Button>
      </div>
    </Card>
  );
};

export default FlashSaleSwipperCard;
