import { TProductDetailType } from "@/types/ProductDetail";
import { Link } from "react-router-dom";
import GlassZoomImage from "../GlassZoomImage";
import { Button } from "../button";

type TPayload = {
  productData: TProductDetailType;
  userRole: string;
  handleAddCart: (productData: TProductDetailType) => any;
  addProductComparison: (productData: TProductDetailType) => any;
};

const ProductDetailTop = ({
  productData,
  userRole,
  handleAddCart,
  addProductComparison,
}: TPayload) => {
  return (
    <div className="mx-auto max-w-screen-lg px-4 md:px-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* images - start  */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-lg bg-gray-100">
            <GlassZoomImage imageSrc={productData?.productImg} />
          </div>
        </div>
        {/* images - end  */}

        {/* {/* content - start  */}
        <div className="md:py-8">
          {/* {/* name - start  */}
          <div className="mb-6 md:mb-10">
            <h2 className="text-3xl font-semibold text-gray-800 lg:text-4xl">
              {productData?.name}
            </h2>
          </div>
          {/* name - end  */}

          {/* price - start  */}
          <div className="mb-6">
            <div className="  text-lg mb-1.5  ">
              Price :{" "}
              <span className=" font-bold text-gray-800 md:text-2xl">
                {productData?.discount
                  ? `${productData?.price - productData?.discount}`
                  : `${productData?.price}`}{" "}
                $
              </span>
            </div>

            <span className="text-sm text-gray-500">
              incl. VAT plus shipping
            </span>
          </div>
          {/* price - end  */}

          {/* product category starts  */}
          <div className="mb-2 flex items-center gap-2 text-gray-600">
            <span className="text-sm text-gray-800 font-medium ">
              Category :
            </span>
            {productData?.category?.name}
          </div>
          {/* product category ends  */}

          {/* {/* shipping notice - start  */}
          <div className="mb-6 flex items-center gap-2 text-gray-500">
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

          {/* {/* buttons - start  */}
          <div className="   ">
            {userRole === "VENDOR" ? (
              "  "
            ) : (
              <div className="btnSection flex items-center gap-x-4 ">
                {/*  */}

                <Button
                  disabled={productData?.inventoryCount === 0 ? true : false}
                  className={`   text-center text-sm font-semibold text-white transition duration-100  ${
                    productData?.inventoryCount === 0
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-prime100 hover:bg-prime200 "
                  }`}
                  onClick={() => handleAddCart(productData)}
                >
                  {productData?.inventoryCount === 0
                    ? "Out of Stock"
                    : `  Add to cart  `}
                </Button>

                {/*  */}

                <Button
                  onClick={() => addProductComparison(productData)}
                  className=" bg-prime100 hover:bg-prime200  "
                >
                  Add To Compare
                </Button>

                {/*  */}
              </div>
            )}
          </div>
          {/* buttons - end  */}

          {/* shop name starts  */}

          <div className="shopNameStarts mt-8">
            <p className=" text-lg font-semibold text-gray-800">Sold by :</p>

            <p className="text-prime100 text-lg font-medium cursor-pointer ">
              <Link to={`/shop/detail/${productData?.shop?.id}`}>
                {productData?.shop?.name}
              </Link>
            </p>
          </div>

          {/* shop name ends  */}
        </div>
        {/* content - end  */}
      </div>
    </div>
  );
};

export default ProductDetailTop;
