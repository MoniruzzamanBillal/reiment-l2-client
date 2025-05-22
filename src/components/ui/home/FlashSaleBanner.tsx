/* eslint-disable @typescript-eslint/no-explicit-any */
import Wrapper from "@/components/shared/Wrapper";
import { useGetFlashSaleProductQuery } from "@/redux/features/product/product.api";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Autoplay, Pagination } from "swiper/modules";
import ProductCard from "../ProductCard";
import { Button } from "../button";

const FlashSaleBanner = () => {
  const { data: allProducts } = useGetFlashSaleProductQuery(undefined);

  return (
    <div className="FlashSaleBannerContainer py-8 ">
      <Wrapper className=" FlashSaleBannerWrapper ">
        {/* heading section  */}
        <div className="headingSection flex justify-between items-center ">
          <h1 className=" mb-8 font-semibold text-prime100 text-xl xsm:text-2xl sm:text-3xl md:text-3xl xl:text-4xl  ">
            Flash Sale
          </h1>
        </div>
        {/* heading section  */}

        <Swiper
          slidesPerView={4}
          spaceBetween={50}
          centeredSlides={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination, Autoplay]}
          className="mySwiper  m-auto flex justify-center items-center "
        >
          {allProducts?.data &&
            allProducts?.data?.map((product: any) => (
              <SwiperSlide className=" mb-9 flex justify-center items-center   ">
                <ProductCard product={product} key={product?.id} />
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
