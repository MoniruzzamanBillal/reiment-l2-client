/* eslint-disable @typescript-eslint/no-explicit-any */
import Wrapper from "@/components/shared/Wrapper";
import { FormSubmitLoading, ProductCard } from "@/components/ui";
import { useGetRecentProductsQuery } from "@/redux/features/product/product.api";
import { UseGetRecentProducts } from "@/utils/SharedFunction";

const RecentProducts = () => {
  const recentProducts = UseGetRecentProducts();

  // console.log(recentProducts);

  const { data: recentProductsData, isLoading: recentProductsLoading } =
    useGetRecentProductsQuery(recentProducts, { skip: !recentProducts });

  // console.log(recentProductsData?.data);

  return (
    <>
      {recentProductsLoading && <FormSubmitLoading />}

      <div className="RecentProductsContainer pt-20 pb-8 bg-gray-100 ">
        <Wrapper className=" RecentProductsWrapper ">
          <h1 className=" mb-8  font-semibold text-prime100 text-xl xsm:text-2xl sm:text-3xl md:text-3xl xl:text-4xl  ">
            Recent Products
          </h1>

          <div className="products mx-auto w-[80%] xsm:w-full grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
            {recentProductsData?.data &&
              recentProductsData?.data?.map((product: any) => (
                <ProductCard product={product} key={product?.id} />
              ))}
          </div>
        </Wrapper>
      </div>
    </>
  );
};

export default RecentProducts;
