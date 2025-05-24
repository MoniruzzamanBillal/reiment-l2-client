import Wrapper from "@/components/shared/Wrapper";
import { useGetAllProductQuery } from "@/redux/features/product/product.api";
import { TProductDetail } from "@/types/globalTypes";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";
import ProductCardSkeleton from "../ProductCardSkeleton";

export type TCategoryOption = {
  name: string;
  value: string;
};

const HomeProducts = () => {
  const { data: allProducts, isLoading } = useGetAllProductQuery({ limit: 8 });

  return (
    <div className="HomeProductsContainer py-6 bg-white ">
      <Wrapper className="HomeProductsWrapper  ">
        {/* heading section  */}
        <div className="headingSection flex justify-between items-center mb-8 ">
          <h1 className="  font-semibold text-prime100 text-xl xsm:text-2xl sm:text-3xl md:text-3xl xl:text-4xl  ">
            Just For You
          </h1>

          <Link
            to={"/products"}
            className=" font-medium text-prime100 hover:bg-prime100 hover:text-gray-50 py-2 px-4 rounded-md "
          >
            Show more
          </Link>
        </div>

        <div className="products  grid grid-cols-1 sm:grid-cols-2 xmd:grid-cols-4 gap-x-5 gap-y-8">
          {isLoading &&
            Array.from({ length: 6 })?.map((_, ind) => (
              <ProductCardSkeleton key={ind} />
            ))}

          {allProducts?.data?.data &&
            allProducts?.data?.data
              ?.slice(4, 8)
              ?.map((product: TProductDetail) => (
                <ProductCard product={product} key={product?.id} />
              ))}
        </div>
      </Wrapper>
    </div>
  );
};

export default HomeProducts;
