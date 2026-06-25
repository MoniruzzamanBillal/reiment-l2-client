"use client";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import Wrapper from "@/components/shared/Wrapper";
import ProductCardSkeleton from "@/components/shared/cards/ProductCardSkeleton";
import FlashSaleProductCard from "@/components/shared/cards/FlashSaleProductCard";
import { useFetchData } from "@/hooks/useApi";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import FlashSaleHeader from "./FlashSaleHeader";

type TFlashProduct = {
  id: string;
  shopId: string;
  name: string;
  price: number;
  discount: number;
  productImg: string;
  category: { id: string; name: string };
  shop: { id: string; name: string };
};

const FlashSaleBanner = () => {
  const { data: allProducts, isLoading } = useFetchData<TFlashProduct[]>(
    ["flashsaleProducts"],
    "/product/flashsale-products"
  );

  const products: TFlashProduct[] = (allProducts as any)?.data ?? [];

  return (
    <div className="FlashSaleBannerContainer py-8">
      <FlashSaleHeader />

      <Wrapper className="FlashSaleBannerWrapper mt-6">
        {isLoading && (
          <div className="mx-auto w-[80%] xsm:w-full grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
            {Array.from({ length: 4 }).map((_, ind) => (
              <ProductCardSkeleton key={ind} />
            ))}
          </div>
        )}

        {products.length > 0 && (
          <Swiper
            effect="coverflow"
            grabCursor
            centeredSlides
            slidesPerView="auto"
            coverflowEffect={{ rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: true }}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            modules={[EffectCoverflow, Pagination, Autoplay]}
            className="mySwiper flash-sale-swiper pb-12"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id} className="!w-80">
                <FlashSaleProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Wrapper>
    </div>
  );
};

export default FlashSaleBanner;
