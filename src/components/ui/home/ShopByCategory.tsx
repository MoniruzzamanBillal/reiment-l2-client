import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination } from "swiper/modules";

import Wrapper from "@/components/shared/Wrapper";
import CategoryCard from "./CategoryCard";
import { useEffect, useState } from "react";
import { useGetAllCategoryQuery } from "@/redux/features/category/category.api";

type TCategory = {
  id: string;
  name: string;
  categoryImg: string;
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
          {categoryOptions &&
            categoryOptions.map((product, ind) => (
              <SwiperSlide className=" mb-5 flex justify-center items-center   ">
                <CategoryCard key={ind} product={product} />
              </SwiperSlide>
            ))}
        </Swiper>
      </Wrapper>
    </div>
  );
};

export default ShopByCategory;
