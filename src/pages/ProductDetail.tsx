import Wrapper from "@/components/shared/Wrapper";
import {
  CartItemReplaceModal,
  CommentInput,
  FormSubmitLoading,
  GlassZoomImage,
  RelatedProductCard,
  UserCommentCard,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useGetSingleProductsQuery } from "@/redux/features/product/product.api";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { TProductDetail } from "@/types/globalTypes";
import {
  useAddProductToCartMutation,
  useGetUserCartQuery,
  useReplaceCartMutation,
} from "@/redux/features/cart/cart.api";
import { GetUserRole } from "@/utils/GetUserRole";

const ProductDetail = () => {
  const { id } = useParams();
  const [comment, setComment] = useState<string | null>(null);
  const [showReplaceModal, setShowReplaceModal] = useState(false);

  if (!id) {
    throw new Error("Something went wrong!! ");
  }

  const { data: productData, isLoading: productDataLoading } =
    useGetSingleProductsQuery(id, { skip: !id });
  const { data: userCardData, refetch: refetchCart } =
    useGetUserCartQuery(undefined);
  const [addProductToCart, { isLoading: addingCartLoading }] =
    useAddProductToCartMutation();
  const [replaceCart, { isLoading: replaceCartItemLoading }] =
    useReplaceCartMutation();

  const userRole = GetUserRole();

  // console.log(userRole);

  // console.log(productData?.data);
  console.log(productData?.data?.categoryId);
  // console.log(userCardData?.data);
  //   console.log(productData?.data?.review);

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      productId: productData?.data?.id,
      quantity: 1,
    };

    const result = await replaceCart(payload);

    //  *  for any  error
    if (result?.error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  //   ! for adding comment
  const handleAddComment = async () => {
    if (!comment?.trim()) {
      toast.error("Add  comment !!");
      return;
    }

    console.log(comment);
  };

  return (
    <>
      {(productDataLoading || addingCartLoading || replaceCartItemLoading) && (
        <FormSubmitLoading />
      )}

      <div className="ProductDetailContainer  ">
        <div className="ProductDetailWrapper  ">
          {/* ShadCN Modal */}
          <CartItemReplaceModal
            showReplaceModal={showReplaceModal}
            setShowReplaceModal={setShowReplaceModal}
            handleReplaceCart={handleReplaceCart}
          />

          <div className="bg-gray-100  py-6 sm:py-8 lg:py-12">
            {/* product detail section starts  */}
            <div className="mx-auto max-w-screen-lg px-4 md:px-8">
              <div className="grid gap-8 md:grid-cols-2">
                {/* images - start  */}
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-lg bg-gray-100">
                    <GlassZoomImage imageSrc={productData?.data?.productImg} />
                  </div>
                </div>
                {/* images - end  */}

                {/* {/* content - start  */}
                <div className="md:py-8">
                  {/* {/* name - start  */}
                  <div className="mb-6 md:mb-10">
                    <h2 className="text-3xl font-semibold text-gray-800 lg:text-4xl">
                      {productData?.data?.name}
                    </h2>
                  </div>
                  {/* name - end  */}

                  {/* price - start  */}
                  <div className="mb-6">
                    <div className="  text-lg mb-1.5  ">
                      Price :{" "}
                      <span className=" font-bold text-gray-800 md:text-2xl">
                        {productData?.data?.discount
                          ? `${
                              productData?.data?.price -
                              productData?.data?.discount
                            }`
                          : `${productData?.data?.price}`}{" "}
                        $
                      </span>
                    </div>

                    <span className="text-sm text-gray-500">
                      incl. VAT plus shipping
                    </span>
                  </div>
                  {/* price - end  */}

                  {/* {/* shipping notice - start  */}
                  <div className="mb-2 flex items-center gap-2 text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                      />
                    </svg>

                    <span className="text-sm">2-4 day shipping</span>
                  </div>
                  {/* shipping notice - end  */}

                  {/* product category starts  */}
                  <div className="mb-6 flex items-center gap-2 text-gray-500">
                    <span className="text-sm">
                      Category : {productData?.data?.category?.name}
                    </span>
                  </div>
                  {/* product category ends  */}

                  {/* {/* buttons - start  */}
                  <div className="   ">
                    {userRole === "VENDOR" ? (
                      "  "
                    ) : (
                      <Button
                        disabled={
                          productData?.data?.inventoryCount === 0 ? true : false
                        }
                        className={`   text-center text-sm font-semibold text-white transition duration-100  ${
                          productData?.data?.inventoryCount === 0
                            ? "cursor-not-allowed bg-gray-400"
                            : "cursor-pointer bg-prime50 hover:bg-prime100 focus-visible:ring active:bg-prime50"
                        }`}
                        onClick={() => handleAddCart(productData?.data)}
                      >
                        {productData?.data?.inventoryCount === 0
                          ? "Out of Stock"
                          : `  Add to cart  `}
                      </Button>
                    )}
                  </div>
                  {/* buttons - end  */}

                  {/* shop name starts  */}

                  <div className="shopNameStarts mt-8">
                    <p className=" text-lg font-semibold text-gray-800">
                      Sold by :
                    </p>

                    <p className="text-prime100 text-lg font-medium cursor-pointer ">
                      <Link to={`/shop/detail/${productData?.data?.shop?.id}`}>
                        {productData?.data?.shop?.name}
                      </Link>
                    </p>
                  </div>

                  {/* shop name ends  */}

                  {/* {/* description - start  */}
                  <div className="mt-5 ">
                    <div className="mb-2 text-lg font-semibold text-gray-800">
                      Description
                    </div>

                    <p className="text-gray-500">
                      {productData?.data?.description}
                    </p>
                  </div>
                  {/* description - end  */}
                </div>
                {/* content - end  */}
              </div>
            </div>
            {/* product detail section ends */}

            {/* detail bottom section starts  */}
            <Wrapper className=" flex flex-col gap-y-8  ">
              {/* review section starts  */}
              <div className="reviewSection    ">
                <h1 className="   font-semibold text-2xl mt-2 mb-6   ">
                  Reviews
                </h1>

                {/* comment input section  */}
                <CommentInput
                  comment={comment}
                  setComment={setComment}
                  handleAddComment={handleAddComment}
                />

                {/* user comment card  section  */}
                {productData?.data?.review &&
                  productData?.data?.review?.map((comment) => (
                    <UserCommentCard review={comment} />
                  ))}
              </div>
              {/* review section ends  */}

              {/* related products section  */}
              <div className="relatedSection  ">
                <h1 className=" text-xl text-gray-900 font-medium ">
                  You may also like
                </h1>

                <div className="relatedProductCards mt-4 grid grid-cols-4 gap-x-5  ">
                  <RelatedProductCard />
                  <RelatedProductCard />
                  <RelatedProductCard />
                  <RelatedProductCard />
                </div>
              </div>

              {/*  */}
            </Wrapper>
            {/* detail bottom section ends   */}
          </div>

          {/*  */}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
