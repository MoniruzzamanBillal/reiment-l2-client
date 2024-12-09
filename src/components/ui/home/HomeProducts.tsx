import Wrapper from "@/components/shared/Wrapper";
import { useGetAllProductQuery } from "@/redux/features/product/product.api";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";
import { TProductResponse } from "@/types/globalTypes";

const HomeProducts = () => {
  const { data: allProducts, isLoading: productDataLoading } =
    useGetAllProductQuery(undefined);

  // console.log(allProducts?.data);

  return (
    <div className="HomeProductsContainer">
      <Wrapper className="HomeProductsWrapper">
        {/* heading section  */}
        <div className="headingSection flex justify-between items-center ">
          <h1 className=" mb-8 font-semibold text-prime100 text-xl xsm:text-2xl sm:text-3xl md:text-3xl xl:text-4xl  ">
            Deals Of The Day
          </h1>

          <Link
            to={"/products"}
            className=" font-medium text-prime100 hover:bg-prime100 hover:text-gray-50 py-2 px-4 rounded-md "
          >
            Show more
          </Link>
        </div>
        {/* heading section  */}

        <div className="products  grid grid-cols-1 sm:grid-cols-2 xmd:grid-cols-3 xlm:grid-cols-4 gap-x-5 gap-y-8">
          {allProducts?.data &&
            allProducts?.data?.map((product: TProductResponse) => (
              <ProductCard product={product} key={product?.id} />
            ))}
        </div>
      </Wrapper>
    </div>
  );
};

export default HomeProducts;
