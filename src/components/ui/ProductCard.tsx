import { TProductDetail } from "@/types/globalTypes";
import { CiShop } from "react-icons/ci";
import { IoMdCart, IoMdGitCompare } from "react-icons/io";
import { Link } from "react-router-dom";
import { Button } from "./button";

const ProductCard = ({ product }: { product: TProductDetail }) => {
  // console.log(product?.discount);
  return (
    <div className="ProductCardContainer bg-white border border-gray-300 shadow-md   rounded-md overflow-auto hover:shadow-lg hover:scale-[1.01] duration-200 ">
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

          <div className="prodDes mb-2 p-3 hover:text-prime200  ">
            {/* prod name  */}
            <h1 className=" font-medium mb-2  "> {product?.name} </h1>

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
        <Button className=" w-[75%]  text-center text-sm font-semibold text-white transition duration-100  bg-prime100 hover:bg-prime200 ">
          <span>
            <IoMdCart />
          </span>
          <span> Add To Cart</span>
        </Button>

        <Button className=" bg-prime100 hover:bg-prime200">
          <IoMdGitCompare />
        </Button>
      </div>
      {/*  */}
    </div>
  );
};

export default ProductCard;
