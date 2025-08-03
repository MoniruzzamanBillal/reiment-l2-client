/* eslint-disable @typescript-eslint/no-explicit-any */
import Wrapper from "@/components/shared/Wrapper";
import {
  CartItemReplaceModal,
  CommentInput,
  FormSubmitLoading,
  RelatedProductCard,
  UserCommentCard,
} from "@/components/ui";
import {
  useGetRelatedProductQuery,
  useGetSingleProductsQuery,
} from "@/redux/features/product/product.api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { ProductDetailTop } from "@/components/ui/ProductDetail";
import { TRelatedProduct } from "@/constants/customer";
import {
  useAddProductToCartMutation,
  useGetUserCartQuery,
  useReplaceCartMutation,
} from "@/redux/features/cart/cart.api";
import { addToComparison } from "@/redux/features/product/product.slice";
import { addRecentProduct } from "@/redux/features/recentProducts/recentProducts.slice";
import {
  useCheckEligibleForReviewQuery,
  useGiveReviewMutation,
} from "@/redux/features/review/review.api";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { TProductDetailType, TReview } from "@/types/ProductDetail";
import { GetUserRole } from "@/utils/GetUserRole";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const comparisonProducts = useAppSelector(
    (state) => state?.comparison?.products
  );

  const [comment, setComment] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [showReplaceModal, setShowReplaceModal] = useState(false);

  if (!id) {
    throw new Error("Something went wrong!! ");
  }

  const {
    data: productData,
    isLoading: productDataLoading,
    refetch: productDataRefetch,
  } = useGetSingleProductsQuery(id, { skip: !id });
  const { data: userCardData, refetch: refetchCart } =
    useGetUserCartQuery(undefined);
  const { data: relatedProductData, isLoading: RelatedProductLoading } =
    useGetRelatedProductQuery(productData?.data?.categoryId, {
      skip: !productData?.data?.categoryId,
    });
  const { data: checkEligibelForReview, refetch: checkEligibility } =
    useCheckEligibleForReviewQuery(id, {
      skip: !id,
    });
  const [addProductToCart, { isLoading: addingCartLoading }] =
    useAddProductToCartMutation();
  const [replaceCart, { isLoading: replaceCartItemLoading }] =
    useReplaceCartMutation();

  const [giveReview, { isLoading: reviewGivingLoading }] =
    useGiveReviewMutation();

  const userRole = GetUserRole();

  // ! for adding item to cart
  const handleAddCart = async (product: TProductDetailType) => {
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
      productId: productData?.data?.id,
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

  //   ! for adding comment
  const handleAddComment = async () => {
    if (!comment?.trim()) {
      toast.error("Add  comment !!");
      return;
    }
    if (rating < 1) {
      toast.error("Give a rating !!");
      return;
    }

    const payload = {
      productId: productData?.data?.id,
      rating,
      comment,
    };

    try {
      const taostId = toast.loading("Giving review....");

      const result = await giveReview(payload);

      console.log(result);

      //  *  for any  error
      if (result?.error) {
        const errorMessage = (result?.error as any)?.data?.message;
        console.log(errorMessage);
        toast.error(errorMessage, {
          id: taostId,
          duration: 1400,
        });
      }
      // * for successful insertion
      if (result?.data) {
        productDataRefetch();
        checkEligibility();
        const successMsg = result?.data?.message;

        toast.success(successMsg, {
          id: taostId,
          duration: 1000,
        });

        setComment("");
        setRating(0);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while giving review!!", {
        duration: 1500,
      });
    }
  };

  // console.log(comparisonProducts);

  // ! for adding product in comparison
  const addProductComparison = (product: any) => {
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
      }
    });

    dispatch(addToComparison(product));
  };

  //
  useEffect(() => {
    if (productData?.data?.id) {
      dispatch(addRecentProduct(productData?.data?.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productData?.data?.id]);

  // console.log(productData?.data);

  // console.log(productData?.data?.description);

  return (
    <>
      {(productDataLoading ||
        addingCartLoading ||
        replaceCartItemLoading ||
        RelatedProductLoading) && <FormSubmitLoading />}

      <div className="ProductDetailContainer  ">
        <div className="ProductDetailWrapper  ">
          {/* Cart replace modal  */}
          <CartItemReplaceModal
            showReplaceModal={showReplaceModal}
            setShowReplaceModal={setShowReplaceModal}
            handleReplaceCart={handleReplaceCart}
          />

          <div className="bg-gray-100  py-6 sm:py-8 lg:py-12">
            {/* product detail top section starts  */}
            <ProductDetailTop
              productData={productData?.data}
              userRole={userRole as string}
              handleAddCart={handleAddCart}
              addProductComparison={addProductComparison}
            />
            {/* product detail top section ends */}

            {/* {/* description - start  */}
            <div className="mt-6 py-6 ">
              <Wrapper>
                <div className="mb-2 text-xl font-bold text-gray-900">
                  Product Description
                </div>

                <div
                  className=" productDetail "
                  dangerouslySetInnerHTML={{
                    __html: productData?.data?.description,
                  }}
                ></div>
              </Wrapper>
            </div>
            {/* description - end  */}

            {/* detail bottom section starts  */}
            <Wrapper className=" flex flex-col gap-y-8  ">
              {/* review section starts  */}
              <div className="reviewSection    ">
                <h1 className="   font-semibold text-2xl mt-3 mb-5   ">
                  Reviews
                </h1>

                {/* comment input section  */}
                {checkEligibelForReview?.data && (
                  <CommentInput
                    comment={comment}
                    setComment={setComment}
                    handleAddComment={handleAddComment}
                    rating={rating}
                    setRating={setRating}
                    reviewGivingLoading={reviewGivingLoading}
                  />
                )}

                {/* for no review  */}
                {!productData?.data?.review?.length && (
                  <p className=" font-semibold text-red-500 ">
                    No Review available{" "}
                  </p>
                )}

                {/* user comment card  section  */}
                {productData?.data?.review &&
                  productData?.data?.review?.map((comment: TReview) => (
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
                  {relatedProductData?.data &&
                    relatedProductData?.data?.map(
                      (product: TRelatedProduct) => (
                        <RelatedProductCard
                          key={product?.id}
                          product={product}
                        />
                      )
                    )}

                  {/* {
                      !relatedProductData && 
                    } */}
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
