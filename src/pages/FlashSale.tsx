import Wrapper from "@/components/shared/Wrapper";
import { ProductCard } from "@/components/ui";
import { useGetFlashSaleProductQuery } from "@/redux/features/product/product.api";

const FlashSale = () => {
  const { data: allProducts } = useGetFlashSaleProductQuery(undefined);

  return (
    <div className="FlashSaleContainer bg-gray-100 py-4  ">
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
