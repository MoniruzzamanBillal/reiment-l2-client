"use client";

import RelatedProductCard from "@/components/shared/cards/RelatedProductCard";
import CartItemReplaceModal from "@/components/shared/modals/CartItemReplaceModal";
import FormSubmitLoading from "@/components/shared/FormSubmitLoading";
import Wrapper from "@/components/shared/Wrapper";
import { useFetchData, usePatch, usePost } from "@/hooks/useApi";
import { useAuthStore } from "@/stores/useAuthStore";
import { useComparisonStore } from "@/stores/useComparisonStore";
import { useRecentProductsStore } from "@/stores/useRecentProductsStore";
import { TProductDetail, TRelatedProduct, TReview } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CommentInput from "./CommentInput";
import ProductDetailTop from "./ProductDetailTop";
import UserCommentCard from "./UserCommentCard";

type TProps = { id: string };

const ProductDetailPage = ({ id }: TProps) => {
  const [comment, setComment] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [showReplaceModal, setShowReplaceModal] = useState(false);

  const user = useAuthStore((s) => s.user);
  const addToComparison = useComparisonStore((s) => s.addToComparison);
  const addRecentProduct = useRecentProductsStore((s) => s.addRecentProduct);

  const {
    data: productData,
    isLoading: productLoading,
    refetch: productRefetch,
  } = useFetchData<TProductDetail>(["product", id], `/product/get-product/${id}`);

  const { data: cartData, refetch: refetchCart } = useFetchData<{
    id: string;
    vendorId: string;
  }>(["userCart"], "/cart/my-cart", { enabled: user?.userRole === "CUSTOMER" });

  const product: TProductDetail | null = (productData as any)?.data ?? null;

  const { data: relatedData, isLoading: relatedLoading } = useFetchData<TRelatedProduct[]>(
    ["relatedProducts", product?.categoryId ?? ""],
    `/product/get-related-products/${product?.categoryId}`,
    { enabled: !!product?.categoryId }
  );

  const { data: checkEligible, refetch: checkEligibility } = useFetchData<boolean>(
    ["checkEligible", id],
    `/review/check-eligible-for-review/${id}`,
    { enabled: !!id && !!user }
  );

  const { mutateAsync: addToCartMutate, isPending: addingCart } = usePost([["userCart"]]);
  const { mutateAsync: replaceMutate, isPending: replacingCart } = usePatch([["userCart"]]);
  const { mutateAsync: giveReviewMutate, isPending: reviewLoading } = usePost([
    ["product", id],
  ]);

  useEffect(() => {
    if (product?.id) addRecentProduct(product.id);
  }, [product?.id, addRecentProduct]);

  const handleAddCart = async () => {
    if (!product) return;
    const cart = (cartData as any)?.data;
    if (!cart || product.shopId === cart.vendorId) {
      const toastId = toast.loading("Adding to cart…");
      try {
        const result: any = await addToCartMutate({
          url: "/cart/add-to-cart",
          payload: { productId: product.id, quantity: 1 },
        });
        if (result?.data?.success) {
          refetchCart();
          toast.success(result.data.message, { id: toastId, duration: 1500 });
        }
      } catch (err: any) {
        const msg =
          err?.response?.status === 401
            ? "Login to add product in the cart"
            : err?.response?.data?.message || "Failed";
        toast.error(msg, { id: toastId, duration: 1400 });
      }
    } else {
      setShowReplaceModal(true);
    }
  };

  const handleReplaceCart = async () => {
    const cart = (cartData as any)?.data;
    try {
      const result: any = await replaceMutate({
        url: "/cart/replace-cart",
        payload: { cartId: cart.id, productId: product?.id, quantity: 1 },
      });
      if (result?.data?.success) {
        refetchCart();
        toast.success(result.data.message, { duration: 1600 });
        setShowReplaceModal(false);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed", { duration: 1400 });
    }
  };

  const handleAddComment = async () => {
    if (!comment?.trim()) { toast.error("Add comment!!"); return; }
    if (rating < 1) { toast.error("Give a rating!!"); return; }
    const toastId = toast.loading("Giving review…");
    try {
      const result: any = await giveReviewMutate({
        url: "/review/give-review",
        payload: { productId: product?.id, rating, comment },
      });
      if (result?.data) {
        productRefetch();
        checkEligibility();
        toast.success(result.data.message, { id: toastId, duration: 1000 });
        setComment("");
        setRating(0);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to give review", {
        id: toastId,
        duration: 1500,
      });
    }
  };

  const handleAddComparison = () => {
    if (!product) return;
    addToComparison(product as any);
    toast.success("Added to comparison");
  };

  const relatedProducts: TRelatedProduct[] = (relatedData as any)?.data ?? [];
  const isEligible = (checkEligible as any)?.data ?? false;

  return (
    <>
      {(productLoading || addingCart || replacingCart || relatedLoading) && (
        <FormSubmitLoading />
      )}

      <div className="ProductDetailContainer pt-8 pb-4">
        <div className="bg-gray-50 py-6 sm:py-8 lg:py-12">
          <CartItemReplaceModal
            showReplaceModal={showReplaceModal}
            setShowReplaceModal={setShowReplaceModal}
            handleReplaceCart={handleReplaceCart}
          />

          <ProductDetailTop
            productData={product}
            userRole={user?.userRole ?? null}
            handleAddCart={handleAddCart}
            addProductComparison={handleAddComparison}
          />

          {/* Description */}
          <div className="mt-6 py-4">
            <Wrapper>
              <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-1 h-5 bg-indigo-600 rounded-full inline-block" />
                  <h2 className="text-xl font-bold text-gray-900">Product Description</h2>
                </div>
                <div
                  className="productDetail text-gray-600 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: product?.description ?? "",
                  }}
                />
              </div>
            </Wrapper>
          </div>

          {/* Reviews + Related */}
          <Wrapper className="flex flex-col gap-y-6 mt-2">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-1 h-6 bg-indigo-600 rounded-full inline-block" />
                <h2 className="font-bold text-2xl text-gray-900">Customer Reviews</h2>
                <span className="text-sm text-gray-400 ml-1">
                  ({product?.review?.length ?? 0})
                </span>
              </div>
              {isEligible && (
                <CommentInput
                  comment={comment}
                  setComment={setComment}
                  handleAddComment={handleAddComment}
                  rating={rating}
                  setRating={setRating}
                  reviewGivingLoading={reviewLoading}
                />
              )}
              {!product?.review?.length && (
                <p className="text-gray-400 text-sm font-medium">No reviews yet. Be the first to review!</p>
              )}
              {product?.review?.map((review: TReview) => (
                <UserCommentCard key={review.id} review={review as any} />
              ))}
            </div>

            {relatedProducts.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-1 h-5 bg-indigo-600 rounded-full inline-block" />
                  <h2 className="text-xl font-bold text-gray-900">You May Also Like</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 xmd:grid-cols-4 lg:grid-cols-5 gap-4">
                  {relatedProducts.map((p) => (
                    <RelatedProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            )}
          </Wrapper>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
