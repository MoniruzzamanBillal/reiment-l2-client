/* eslint-disable @typescript-eslint/no-explicit-any */
import Wrapper from "@/components/shared/Wrapper";
import { useGetFlashSaleProductQuery } from "@/redux/features/product/product.api";

import { FaFireFlameCurved } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Autoplay, Pagination } from "swiper/modules";
import { Button } from "../button";
import FlashSaleProductCard from "../FlashSaleProductCard";
import ProductCardSkeleton from "../ProductCardSkeleton";

const flashProductShowbreakpoints = {
  0: { slidesPerView: 1, spaceBetween: 16 },
  500: { slidesPerView: 2, spaceBetween: 24 },
  780: { slidesPerView: 3, spaceBetween: 24 },
  1080: { slidesPerView: 4, spaceBetween: 20 },
};

const FlashSaleBanner = () => {
  const { data: allProducts, isLoading } =
    useGetFlashSaleProductQuery(undefined);

  console.log(allProducts?.data);

  return (
    <div className="FlashSaleBannerContainer py-8 ">
      <Wrapper className=" FlashSaleBannerWrapper ">
        {/* heading section  */}
        <div className="headingSection mb-8 flex  items-center gap-x-1  ">
          <FaFireFlameCurved className=" text-2xl text-orange-400 font-semibold " />
          <h1 className="  font-semibold text-prime100 text-xl xsm:text-2xl sm:text-3xl md:text-3xl xl:text-4xl  ">
            Flash Sale
          </h1>
        </div>
        {/* heading section  */}

        <div className="allProducts mx-auto w-[80%] xsm:w-full grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8 ">
          {isLoading &&
            Array.from({ length: 4 })?.map((_, ind) => (
              <ProductCardSkeleton key={ind} />
            ))}
        </div>

        <Swiper
          centeredSlides={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination, Autoplay]}
          breakpoints={flashProductShowbreakpoints}
          className="mySwiper  mx-auto w-[80%] xsm:w-full flex justify-center items-center "
        >
          {allProducts?.data &&
            allProducts?.data?.map((product: any) => (
              <SwiperSlide className=" mb-9 flex justify-center items-center   ">
                <FlashSaleProductCard product={product} key={product?.id} />
              </SwiperSlide>
            ))}
        </Swiper>

        <div className="btnSection  flex justify-center my-2 ">
          <Link to={"/flash-sale"}>
            <Button className="font-medium bg-prime100  hover:bg-prime100  ">
              Show More{" "}
            </Button>
          </Link>
        </div>
      </Wrapper>
    </div>
  );
};

export default FlashSaleBanner;
