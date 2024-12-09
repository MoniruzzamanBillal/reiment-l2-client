import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  //   console.log(product);
  return (
    <div className="ProductCardContainer bg-white border border-gray-200 shadow-md group  rounded-t-md overflow-auto hover:shadow-lg hover:scale-[1.01] duration-200 ">
      <Link to={`/product/detail/${product?.id}`}>
        <div className="ProductCardWrapper flex flex-col gap-y-3  ">
          {/* product image section  */}
          <div className="prodImg  h-[14rem] ">
            <img className=" w-full h-full " src={product?.productImg} alt="" />
          </div>

          <div className="prodDes pb-3 px-3 group-hover:text-prime100  ">
            {/* prod name  */}
            <h1 className=" font-medium mb-2 text-lg "> {product?.name} </h1>

            {/* prod price  */}
            <p className=" font-semibold "> {product?.price} $</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
