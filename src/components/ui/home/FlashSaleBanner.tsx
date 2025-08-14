import Wrapper from "@/components/shared/Wrapper";
import { useGetFlashSaleProductQuery } from "@/redux/features/product/product.api";
import ProductCardSkeleton from "../ProductCardSkeleton";
import FlashSaleHeader from "./FlashSaleHeader";

import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import FlashSaleSwipperCard from "../FlashSaleSwipperCard";

type TCategory = {
  categoryImg: string;
  createdAt: string;
  id: string;
  isDelated: boolean;
  name: string;
  updatedAt: string;
  categoryId: string;
};

type TShop = {
  createdAt: string;
  description: string;
  id: string;
  isDelated: boolean;
  logo: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  updatedAt: string;
  vendorId: string;
};

type TProduct = {
  category: TCategory;
  categoryId: string;
  createdAt: string;
  description: string;
  discount: number;
  id: string;
  inventoryCount: number;
  isDelated: boolean;
  name: string;
  price: number;
  productImg: string;
  shop: TShop;
  shopId: string;
  updatedAt: string;
};

const FlashSaleBanner = () => {
  const { data: allProducts, isLoading } =
    useGetFlashSaleProductQuery(undefined);

  return (
    <div className="FlashSaleBannerContainer py-8 ">
      <FlashSaleHeader />

      <Wrapper className=" FlashSaleBannerWrapper mt-6  ">
        <div className="allProducts mx-auto w-[80%] xsm:w-full grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8 ">
          {isLoading &&
            Array.from({ length: 4 })?.map((_, ind) => (
              <ProductCardSkeleton key={ind} />
            ))}
        </div>

        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          modules={[EffectCoverflow, Pagination, Autoplay]}
          className="mySwiper flash-sale-swiper pb-12  "
        >
          {allProducts?.data &&
            allProducts?.data?.map((product: TProduct) => (
              <SwiperSlide key={product.id} className="!w-80 ">
                <FlashSaleSwipperCard product={product} />
              </SwiperSlide>
            ))}
        </Swiper>
      </Wrapper>
    </div>
  );
};

export default FlashSaleBanner;
