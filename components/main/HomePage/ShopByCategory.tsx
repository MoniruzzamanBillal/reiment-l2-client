"use client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Wrapper from "@/components/shared/Wrapper";
import CategoryCard from "@/components/shared/cards/CategoryCard";
import CategoryCardSkeleton from "@/components/shared/cards/CategoryCardSkeleton";
import { useFetchData } from "@/hooks/useApi";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

type TCategory = { id: string; name: string; categoryImg: string };

const categoryBreakpoints = {
  0: { slidesPerView: 2, spaceBetween: 16 },
  640: { slidesPerView: 3, spaceBetween: 24 },
  768: { slidesPerView: 4, spaceBetween: 24 },
  1024: { slidesPerView: 5, spaceBetween: 32 },
  1280: { slidesPerView: 6, spaceBetween: 32 },
};

const ShopByCategory = () => {
  const { data: categoryData, isLoading } = useFetchData<TCategory[]>(
    ["allCategory"],
    "/category/all-category"
  );

  const categories: TCategory[] = (categoryData as any)?.data ?? [];
  const categoryOptions = categories.map((item) => ({
    name: item.name,
    value: item.id,
    categoryImg: item.categoryImg,
  }));

  return (
    <div className="categoryContainer bg-gray-50/60 py-10">
      <Wrapper className="categoryWrapper m-auto">
        <div className="text-center mb-10">
          <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full mb-3">
            Categories
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Browse by Category</h2>
          <p className="text-gray-500 mt-2 text-sm">Explore our wide range of product categories</p>
        </div>

        {isLoading && (
          <div className="mx-auto w-[80%] xsm:w-full grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-8">
            {Array.from({ length: 5 }).map((_, ind) => (
              <CategoryCardSkeleton key={ind} />
            ))}
          </div>
        )}

        {categoryOptions.length > 0 && (
          <Swiper
            centeredSlides
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={categoryBreakpoints}
            modules={[Pagination, Autoplay]}
            className="mySwiper m-auto flex justify-center items-center"
          >
            {categoryOptions.map((category, ind) => (
              <SwiperSlide
                key={ind}
                className="mb-9 flex justify-center items-center"
              >
                <CategoryCard category={category} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Wrapper>
    </div>
  );
};

export default ShopByCategory;
