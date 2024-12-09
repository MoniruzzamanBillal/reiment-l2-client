import { Link } from "react-router-dom";
import { CiShop } from "react-icons/ci";

import { Button } from "./button";

const ProductCard = ({ product }) => {
  // console.log(product);
  return (
    <div className="ProductCardContainer bg-white border border-gray-200 shadow-md group  rounded-md overflow-auto hover:shadow-lg hover:scale-[1.01] duration-200 ">
      <Link to={`/product/detail/${product?.id}`}>
        <div className="ProductCardWrapper flex flex-col gap-y-1  ">
          {/* product image section  */}
          <div className="prodImg  h-[14rem] relative ">
            <img className=" w-full h-full " src={product?.productImg} alt="" />

            {/* category name section */}
            <div className="categorySection bg-prime50/80 py-.5 px-2 rounded-md text-gray-50 font-medium absolute top-0 left-0 ">
              <p>{product?.category?.name}</p>
            </div>
          </div>

          <div className="prodDes p-3 group-hover:text-prime100  ">
            {/* prod name  */}
            <h1 className=" font-medium mb-2 text-lg "> {product?.name} </h1>

            <div className="productPriceShopName flex justify-between items-center ">
              {/* prod price  */}
              <div className="prodPrice">
                <p className=" font-semibold  text-lg "> $ {product?.price} </p>
                <p className=" font-medium line-through text-gray-600 ">
                  {" "}
                  $ {product?.price}{" "}
                </p>
              </div>

              {/* shop name  */}
              <div className="shopName flex justify-between items-center gap-x-1 bg-prime50/40 p-[0.2rem] rounded-md font-semibold text-gray-900 ">
                <CiShop className=" text-xl font-bold " />
                <p>{product?.shop?.name}</p>
              </div>
            </div>

            {/* add to cart button  */}
            <div className="addToCartBtn pt-5  ">
              <Button className=" w-full bg-prime100 hover:bg-prime100 font-semibold text-gray-50 ">
                Detail
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
