import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Autoplay, Pagination } from "swiper/modules";

import Wrapper from "@/components/shared/Wrapper";
import { useGetAllCategoryQuery } from "@/redux/features/category/category.api";
import { useEffect, useState } from "react";
import CategoryCardSkeleton from "../CategoryCardSkeleton";
import CategoryCard from "./CategoryCard";

type TCategory = {
  id: string;
  name: string;
  categoryImg: string;
};

// Responsive breakpoints
const categoryShowbreakpoints = {
  0: { slidesPerView: 2, spaceBetween: 16 },
  640: { slidesPerView: 3, spaceBetween: 24 },
  768: { slidesPerView: 4, spaceBetween: 24 },
  1024: { slidesPerView: 5, spaceBetween: 32 },
  1280: { slidesPerView: 6, spaceBetween: 32 },
};

const ShopByCategory = () => {
  const { data: categoryData, isLoading: categoryDataLoading } =
    useGetAllCategoryQuery(undefined);
  const [categoryOptions, setCategoryOptions] = useState([]);

  // console.log(categoryData?.data);

  //   ! effect for get category data
  useEffect(() => {
    if (categoryData?.data) {
      const modifiedData = categoryData?.data?.map((item: TCategory) => {
        const optionValue = {
          name: item?.name,
          value: item?.id,
          categoryImg: item?.categoryImg,
        };

        return optionValue;
      });

      setCategoryOptions(modifiedData);
    }
  }, [categoryData?.data, categoryDataLoading]);

  // console.log(categoryOptions);

  return (
    <div className="categoryContainer bg-gray-50 py-6   ">
      <Wrapper className=" categoryWrapper m-auto ">
        <h1 className=" mb-8   text-center font-semibold text-prime100 text-xl xsm:text-2xl sm:text-3xl md:text-3xl xl:text-4xl  ">
          Browse by categories
        </h1>

        <div className="allProducts mx-auto w-[80%] xsm:w-full grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-8 ">
          {categoryDataLoading &&
            Array.from({ length: 5 })?.map((_, ind) => (
              <CategoryCardSkeleton key={ind} />
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
          breakpoints={categoryShowbreakpoints}
          modules={[Pagination, Autoplay]}
          className="mySwiper  m-auto flex justify-center items-center "
        >
          {categoryOptions &&
            categoryOptions.map((category, ind) => (
              <SwiperSlide className=" mb-9 flex justify-center items-center   ">
                <CategoryCard key={ind} category={category} />
              </SwiperSlide>
            ))}
        </Swiper>
      </Wrapper>
    </div>
  );
};

export default ShopByCategory;
