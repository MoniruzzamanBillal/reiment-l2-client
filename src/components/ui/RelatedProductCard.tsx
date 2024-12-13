import { TRelatedProduct } from "@/constants/customer";
import { Link } from "react-router-dom";

const RelatedProductCard = ({ product }: { product: TRelatedProduct }) => {
  // console.log(product);
  return (
    <Link to={`/product/detail/${product?.id}`}>
      <div className="RelatedProductCard bg-gray-50 py-3 cursor-pointer group flex flex-col items-center gap-y-1 border border-gray-300 rounded-md shadow-md hover:shadow-lg hover:scale-[1.01] duration-200 overflow-hidden ">
        {/* product image  */}
        <div className="relatedProductImg size-[9rem]  ">
          <img
            className="w-full h-full"
            // src="https://i.ibb.co/DtqW079/sleeping-Bag.jpg"
            src={product?.productImg}
            alt=""
          />
        </div>

        {/* prod name  */}
        <div className="productName   ">
          <p className=" font-medium group-hover:text-prime100 text-center ">
            {product?.name}
          </p>
        </div>

        {/* product price  */}
        <div className="productPrice  ">
          <p className=" font-medium  group-hover:text-prime100 ">
            {product?.discount
              ? `${product?.price - product?.discount}`
              : `${product?.price}`}
            $
          </p>
        </div>

        {/*  */}
      </div>
    </Link>
  );
};

export default RelatedProductCard;
