import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination } from "swiper/modules";

import Wrapper from "@/components/shared/Wrapper";
import CategoryCard from "./CategoryCard";

const productsCategory = [
  {
    productName: "Sleeping Bag",
    productIMG: "https://i.postimg.cc/C1Y8bMC2/running-thumb.png",
  },
  {
    productName: "Tent",
    productIMG: "https://i.postimg.cc/x81bFs4y/soccer-thumb.png",
  },
  {
    productName: "Lantern",
    productIMG: "https://i.postimg.cc/C1Y8bMC2/running-thumb.png",
  },
  {
    productName: "Char coal",
    productIMG: "https://i.postimg.cc/x81bFs4y/soccer-thumb.png",
  },
  {
    productName: "Multifunctional Tool",
    productIMG: "https://i.postimg.cc/C1Y8bMC2/running-thumb.png",
  },
];

const ShopByCategory = () => {
  return (
    <div className="categoryContainer bg-gray-50 py-8   ">
      <Wrapper className=" categoryWrapper m-auto ">
        <h1 className=" mb-8   text-center font-semibold text-prime100 text-xl xsm:text-2xl sm:text-3xl md:text-3xl xl:text-4xl  ">
          Browse by categories
        </h1>

        <Swiper
          slidesPerView={5}
          spaceBetween={30}
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
          {productsCategory &&
            productsCategory.map((product, ind) => (
              <SwiperSlide className=" m-auto flex justify-center items-center  ">
                <CategoryCard key={ind} product={product} />
              </SwiperSlide>
            ))}
        </Swiper>
      </Wrapper>
    </div>
  );
};

export default ShopByCategory;
