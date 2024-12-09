import Wrapper from "@/components/shared/Wrapper";
import {
  CommentInput,
  GlassZoomImage,
  RelatedProductCard,
  UserCommentCard,
} from "@/components/ui";
import { useGetSingleProductsQuery } from "@/redux/features/product/product.api";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const [comment, setComment] = useState<string | null>(null);

  if (!id) {
    throw new Error("Something went wrong!! ");
  }

  const { data: productData, isLoading: productDataLoading } =
    useGetSingleProductsQuery(id, { skip: !id });

  //   console.log(productData?.data);
  //   console.log(productData?.data?.review);

  //   ! for adding comment
  const handleAddComment = async () => {
    if (!comment?.trim()) {
      toast.error("Add  comment !!");
      return;
    }

    console.log(comment);
  };

  return (
    <div className="ProductDetailContainer  ">
      <div className="ProductDetailWrapper  ">
        <div className="bg-gray-100  py-6 sm:py-8 lg:py-12">
          {/* product top section starts  */}
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
                    Price :
                    <span className=" font-bold text-gray-800 md:text-2xl">
                      {productData?.data?.price}$
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
                  <button
                    disabled={
                      productData?.data?.inventoryCount === 0 ? true : false
                    }
                    className={`inline-block flex-1 rounded-lg px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 sm:flex-none md:text-base ${
                      productData?.data?.inventoryCount === 0
                        ? "cursor-not-allowed bg-gray-400"
                        : "cursor-pointer bg-indigo-500 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700"
                    }`}
                    // onClick={handleAddCart}
                  >
                    {productData?.data?.inventoryCount === 0
                      ? "Out of Stock"
                      : "Add to cart"}
                  </button>
                </div>
                {/* buttons - end  */}

                {/* shop name starts  */}

                <div className="shopNameStarts mt-8">
                  <div className="mb-1 text-lg font-semibold text-gray-800">
                    Sold by :
                  </div>

                  <p className="text-prime100 text-lg font-medium cursor-pointer ">
                    {productData?.data?.shop?.name}
                  </p>
                </div>

                {/* shop name ends  */}

                {/* {/* description - start  */}
                <div className="mt-10 ">
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
          {/* product top section ends */}

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
  );
};

export default ProductDetail;
