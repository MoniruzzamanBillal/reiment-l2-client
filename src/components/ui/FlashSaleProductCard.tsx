import {
  useAddProductToCartMutation,
  useGetUserCartQuery,
  useReplaceCartMutation,
} from "@/redux/features/cart/cart.api";
import { useState } from "react";
import { IoMdCart } from "react-icons/io";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "./button";
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

const FlashSaleProductCard = ({ product }: { product: TProduct }) => {
  const [showReplaceModal, setShowReplaceModal] = useState(false);

  const { data: userCardData, refetch: refetchCart } =
    useGetUserCartQuery(undefined);

  const [addProductToCart, { isLoading: addingCartLoading }] =
    useAddProductToCartMutation();

  const [replaceCart] = useReplaceCartMutation();

  // console.log(product);
  // console.log(userCardData?.data);

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

  return (
    <div className="ProductCardContainer   ">
      {/* Cart replace modal  */}
      <CartItemReplaceModal
        showReplaceModal={showReplaceModal}
        setShowReplaceModal={setShowReplaceModal}
        handleReplaceCart={handleReplaceCart}
      />

      <div className="productCartWrappwer bg-gray-200/70 border border-gray-400 shadow-md   rounded-md overflow-auto hover:shadow-lg hover:scale-[1.01] duration-200 flex flex-col  justify-between  ">
        {/*  */}
        <Link className="   " to={`/product/detail/${product?.id}`}>
          <div className="ProductCardWrapper flex flex-col  justify-between    ">
            {/* product image section  */}
            <div className="prodImg  h-[14rem] relative ">
              <img
                className=" w-full h-full "
                src={product?.productImg as string}
                alt=""
              />

              {/* category name section */}
              <div className="categorySection bg-prime50/80 py-.5 px-2 rounded-md text-gray-50 text-xs font-medium absolute top-0 left-0 ">
                <p>{product?.category?.name}</p>
              </div>
            </div>

            <div className="prodDes mb-1 p-3 hover:text-prime200  ">
              {/* prod name  */}
              <h1 className=" font-medium mb-2 text-center text-lg  ">
                {product?.name}
              </h1>

              <div className="productPriceShopName   flex justify-center  items-center gap-x-2 text-lg ">
                {/* prod price  */}
                <p className=" font-semibold   ">
                  $ {product?.price - product?.discount}
                </p>
                <p className=" font-medium line-through text-gray-600 ">
                  $ {product?.price}
                </p>
              </div>
            </div>
          </div>
        </Link>
        {/*  */}

        <div className="buttonSectio pb-2 px-2  mx-auto   ">
          <Button
            disabled={addingCartLoading}
            onClick={() => handleAddCart(product)}
            className="   text-center text-sm font-semibold text-white transition duration-100  bg-prime100 hover:bg-prime200 "
          >
            <span>
              <IoMdCart />
            </span>
            <span>
              {" "}
              {addingCartLoading ? "Adding to cart" : "Add To Cart"}{" "}
            </span>
          </Button>
        </div>
        {/*  */}
      </div>

      {/*  */}
    </div>
  );
};

export default FlashSaleProductCard;
