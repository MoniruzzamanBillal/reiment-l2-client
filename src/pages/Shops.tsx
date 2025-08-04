import Wrapper from "@/components/shared/Wrapper";
import { ShopCard, ShopCardSkeleton } from "@/components/ui";
import { useGetAllPublicShopQuery } from "@/redux/features/shop/shop.api";

import { TShopDetail } from "@/types/globalTypes";

const Shops = () => {
  const { data: allShopData, isLoading } = useGetAllPublicShopQuery(undefined);

  console.log(allShopData?.data);

  return (
    <div className="ShopsContainer bg-gray-100 pt-16 pb-4 min-h-screen ">
      <Wrapper>
        <h1 className="   font-semibold text-prime100 text-xl xsm:text-2xl sm:text-3xl md:text-3xl xl:text-4xl mb-6 ">
          Shops
        </h1>

        {/* shop card  */}
        <div className="shopcards mx-auto w-[80%] xsm:w-full grid grid-cols-1 xsm:grid-cols-2 lg:grid-cols-4 gap-6 ">
          {isLoading &&
            Array.from({ length: 6 })?.map((_, ind) => (
              <ShopCardSkeleton key={ind} />
            ))}

          {allShopData?.data?.map((shop: TShopDetail) => (
            <ShopCard key={shop?.id} shop={shop} />
          ))}
        </div>
      </Wrapper>
    </div>
  );
};

export default Shops;
