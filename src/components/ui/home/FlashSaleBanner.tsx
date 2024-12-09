import Wrapper from "@/components/shared/Wrapper";
import { useGetAllProductQuery } from "@/redux/features/product/product.api";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination } from "swiper/modules";
import ProductCard from "../ProductCard";

const FlashSaleBanner = () => {
  const { data: allProducts, isLoading: productDataLoading } =
    useGetAllProductQuery(undefined);

  return (
    <div className="FlashSaleBannerContainer py-8 ">
      <Wrapper className=" FlashSaleBannerWrapper ">
        {/* heading section  */}
        <div className="headingSection flex justify-between items-center ">
          <h1 className=" mb-8 font-semibold text-prime100 text-xl xsm:text-2xl sm:text-3xl md:text-3xl xl:text-4xl  ">
            Flash Sale
          </h1>

          <Link
            to={"/products"}
            className=" font-medium text-prime100 hover:bg-prime100 hover:text-gray-50 py-2 px-4 rounded-md "
          >
            Show more
          </Link>
        </div>
        {/* heading section  */}

        <Swiper
          slidesPerView={3}
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
            allProducts?.data?.map((product) => (
              <SwiperSlide className=" mb-9 flex justify-center items-center   ">
                <ProductCard product={product} key={product?.id} />
              </SwiperSlide>
            ))}
        </Swiper>
      </Wrapper>
    </div>
  );
};

export default FlashSaleBanner;
