import Wrapper from "@/components/shared/Wrapper";
import { useGetAllProductQuery } from "@/redux/features/product/product.api";
import { TProductDetail } from "@/types/globalTypes";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";
import ProductCardSkeleton from "../ProductCardSkeleton";

const NewArrival = () => {
  const { data: allProducts, isLoading } = useGetAllProductQuery({ limit: 4 });

  // console.log(allProducts?.data?.data);

  return (
    <div className="NewArrivalContainer py-8">
      <Wrapper className=" NewArrivalWrapper  ">
        {/* heading section  */}
        <div className="headingSection flex justify-between items-center ">
          <h1 className=" mb-8 font-semibold text-prime100 text-xl xsm:text-2xl sm:text-3xl md:text-3xl xl:text-4xl  ">
            Newly Arrival
          </h1>

          <Link
            to={"/products"}
            className=" font-medium text-prime100 hover:bg-prime100 hover:text-gray-50 py-2 px-4 rounded-md "
          >
            Show more
          </Link>
        </div>

        {/* product section  */}
        <div className="products  mx-auto w-[80%] xsm:w-full  grid grid-cols-1 xsm:grid-cols-2 xmd:grid-cols-4 gap-x-5 gap-y-8">
          {isLoading &&
            Array.from({ length: 6 })?.map((_, ind) => (
              <ProductCardSkeleton key={ind} />
            ))}

          {allProducts?.data?.data &&
            allProducts?.data?.data?.map((product: TProductDetail) => (
              <ProductCard product={product} key={product?.id} />
            ))}
        </div>
      </Wrapper>
    </div>
  );
};

export default NewArrival;
