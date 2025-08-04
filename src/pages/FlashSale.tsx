import Wrapper from "@/components/shared/Wrapper";
import { ProductCard, ProductCardSkeleton } from "@/components/ui";
import { useGetFlashSaleProductQuery } from "@/redux/features/product/product.api";

const FlashSale = () => {
  const { data: allProducts, isLoading } =
    useGetFlashSaleProductQuery(undefined);

  // console.log(allProducts?.data);

  return (
    <div className="FlashSaleContainer bg-gray-100 pt-16 pb-4  ">
      <Wrapper className=" FlashSaleWrapper  ">
        {/* heading section  */}
        <div className="headingSection mb-8 flex items-center gap-x-3  ">
          <h1 className="   font-semibold text-prime100 text-xl xsm:text-2xl sm:text-3xl md:text-3xl xl:text-4xl  ">
            Flash Sale
          </h1>

          <p className=" text-lg font-medium ">
            ( {allProducts?.data?.length} Products Found){" "}
          </p>
        </div>
        {/* heading section  */}

        {/* product card section  */}

        {/* all products  */}
        <div className="allProducts mx-auto w-[80%] xsm:w-full grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8 ">
          {isLoading &&
            Array.from({ length: 6 })?.map((_, ind) => (
              <ProductCardSkeleton key={ind} />
            ))}

          {allProducts?.data &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            allProducts?.data?.map((product: any) => (
              <ProductCard product={product} key={product?.id} />
            ))}
        </div>
      </Wrapper>
    </div>
  );
};

export default FlashSale;
