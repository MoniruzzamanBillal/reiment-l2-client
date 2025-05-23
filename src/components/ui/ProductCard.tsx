import {
  useAddProductToCartMutation,
  useGetUserCartQuery,
  useReplaceCartMutation,
} from "@/redux/features/cart/cart.api";
import { addToComparison } from "@/redux/features/product/product.slice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { TProductDetail } from "@/types/globalTypes";
import { useState } from "react";
import { CiShop } from "react-icons/ci";
import { IoMdCart, IoMdGitCompare } from "react-icons/io";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "./button";
import CartItemReplaceModal from "./CartItemReplaceModal";

const ProductCard = ({ product }: { product: TProductDetail }) => {
  // console.log(product?.discount);

  const dispatch = useAppDispatch();
  const [showReplaceModal, setShowReplaceModal] = useState(false);

  const { data: userCardData, refetch: refetchCart } =
    useGetUserCartQuery(undefined);

  const comparisonProducts = useAppSelector(
    (state) => state?.comparison?.products
  );

  const [addProductToCart, { isLoading: addingCartLoading }] =
    useAddProductToCartMutation();

  const [replaceCart, { isLoading: replaceCartItemLoading }] =
    useReplaceCartMutation();

  // console.log(product);
  // console.log(userCardData?.data);

  // ! for adding item to cart
  const handleAddCart = async (product: TProductDetail) => {
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

  // ! for adding product in comparison
  const addProductComparison = (product: TProductDetail) => {
    if (comparisonProducts?.length === 3) {
      toast.error("You can only compare up to three products!", {
        duration: 1800,
      });
      return;
    }
    comparisonProducts?.some((compareProduct) => {
      if (compareProduct?.categoryId !== product?.categoryId) {
        toast.error("You can not compare different product category!!", {
          duration: 1800,
        });
      }

      if (compareProduct?.id === product?.id) {
        toast.error("This product is already selected !!", {
          duration: 1800,
        });
      } else {
        toast.error("Product added to comparison successfully !!", {
          duration: 1800,
        });
      }
    });

    dispatch(addToComparison(product));
  };

  return (
    <div className="ProductCardContainer bg-white border border-gray-300 shadow-md   rounded-md overflow-auto hover:shadow-lg hover:scale-[1.01] duration-200 flex flex-col justify-between ">
      {/* Cart replace modal  */}
      <CartItemReplaceModal
        showReplaceModal={showReplaceModal}
        setShowReplaceModal={setShowReplaceModal}
        handleReplaceCart={handleReplaceCart}
      />

      <Link to={`/product/detail/${product?.id}`}>
        <div className="ProductCardWrapper flex flex-col justify-between gap-y-1  ">
          {/* product image section  */}
          <div className="prodImg  h-[15rem] relative ">
            <img
              className=" w-full h-full "
              src={product?.productImg as string}
              alt=""
            />

            {/* category name section */}
            <div className="categorySection bg-prime50/80 py-.5 px-2 rounded-md text-gray-50 text-sm font-medium absolute top-0 left-0 ">
              <p>{product?.category?.name}</p>
            </div>
          </div>

          <div className="prodDes mb-1 p-3 hover:text-prime200  ">
            {/* prod name  */}
            <h1 className=" font-medium mb-2.5  "> {product?.name} </h1>

            <div className="productPriceShopName flex justify-between items-center ">
              {/* prod price  */}
              <div className="prodPrice flex items-center gap-x-2 ">
                {product?.discount && product?.discount > 60 ? (
                  <>
                    <p className=" font-semibold  text-lg ">
                      $ {product?.price - product?.discount}
                    </p>
                    <p className=" font-medium line-through text-gray-600 ">
                      $ {product?.price}
                    </p>
                  </>
                ) : (
                  <p className=" font-semibold  text-lg ">
                    $ {product?.price}{" "}
                  </p>
                )}
              </div>

              {/* shop name  */}
              <div className="shopName flex justify-between items-center gap-x-1 bg-prime50/40 p-[0.2rem] rounded-md font-semibold text-gray-900 ">
                <CiShop className=" text-xl font-bold " />
                <p className=" text-sm ">{product?.shop?.name}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/*  */}
      <div className="buttonSectio pb-2 px-2 flex justify-between   ">
        <Button
          disabled={addingCartLoading}
          onClick={() => handleAddCart(product)}
          className=" w-[75%]  text-center text-sm font-semibold text-white transition duration-100  bg-prime100 hover:bg-prime200 "
        >
          <span>
            <IoMdCart />
          </span>
          <span> {addingCartLoading ? "Adding to cart" : "Add To Cart"} </span>
        </Button>

        <Button
          onClick={() => addProductComparison(product)}
          className=" bg-prime100 hover:bg-prime200"
        >
          <IoMdGitCompare />
        </Button>
      </div>
      {/*  */}
    </div>
  );
};

export default ProductCard;
