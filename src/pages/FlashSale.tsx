import Wrapper from "@/components/shared/Wrapper";
import { ProductCard } from "@/components/ui";
import { useGetAllProductQuery } from "@/redux/features/product/product.api";

const FlashSale = () => {
  const { data: allProducts, isLoading: productDataLoading } =
    useGetAllProductQuery(undefined);

  return (
    <div className="FlashSaleContainer py-2">
      <Wrapper className=" FlashSaleWrapper  ">
        {/* heading section  */}
        <div className="headingSection mb-8 flex items-center gap-x-3  ">
          <h1 className="   font-semibold text-prime100 text-xl xsm:text-2xl sm:text-3xl md:text-3xl xl:text-4xl  ">
            Flash Sale
          </h1>

          <p className=" text-lg font-medium ">
            {" "}
            ( {allProducts?.data?.length} Products Found){" "}
          </p>
        </div>
        {/* heading section  */}

        {/* product card section  */}
        <div className="productCard grid grid-cols-4 gap-x-4 gap-y-8 ">
          {allProducts?.data &&
            allProducts?.data?.map((product) => (
              <ProductCard product={product} key={product?.id} />
            ))}
        </div>
      </Wrapper>
    </div>
  );
};

export default FlashSale;
