import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Wrapper from "@/components/shared/Wrapper";
import { useGetAllCategoryQuery } from "@/redux/features/category/category.api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Autoplay, Pagination } from "swiper/modules";
import HeroBannerCard from "./HeroBannerCard";

export type TBanner = {
  subHeading: string;
  heading: string;
  description: string;
  bannerImg: string;
};

type TCategoryOption = {
  name: string;
  value: string;
};

type TCategory = {
  id: string;
  name: string;
};

const bannerInfo: TBanner[] = [
  {
    subHeading: "Shop Smarter, Live Better",
    heading: "Unleash the Joy of Seamless Shopping",
    description:
      "Discover an exciting range of products tailored to your needs. From trendy fashion to must-have gadgets, shop now and enjoy unbeatable deals, fast delivery, and a hassle-free shopping experience. Start your journey today!",
    bannerImg: "https://i.postimg.cc/4yLk8bVM/pexels-asphotograpy-230544.jpg",
  },

  {
    subHeading: "Exclusive Deals Await You",
    heading: "Shop the Best Products at Unmatched Prices",
    description:
      "Get ready to save big! Explore our exclusive collection of premium products with irresistible discounts and limited-time offers. Don’t miss out—grab your favorites before they’re gone!",
    bannerImg:
      "https://i.postimg.cc/x872MmFp/pexels-imin-technology-276315592-12935091.jpg",
  },

  {
    subHeading: "Your Dream Products Are Just a Click Away",
    heading: "Find Everything You Love, All in One Place",
    description:
      "Whether you’re upgrading your wardrobe, enhancing your home, or picking up essentials, we’ve got you covered. Browse, compare, and buy with ease. Start shopping now and turn your dreams into reality!",
    bannerImg:
      "https://i.postimg.cc/HLXmpM1c/pexels-vlada-karpovich-4050388-1.jpg",
  },

  {
    subHeading: "Follow Your Favorite Shops",
    heading: "Get Personalized Recommendations",
    description:
      "Follow your favorite shops and stay updated with their latest collections and exclusive deals. Discover products handpicked just for you and elevate your shopping game like never before!",
    bannerImg: "https://i.postimg.cc/26r8SnP4/pexels-quintingellar-696205.jpg",
  },

  {
    subHeading: "Flash Sales Every Day!",
    heading: "Don’t Miss Out on Today’s Best Deals",
    description:
      "Enjoy incredible discounts during our daily flash sales. Limited products, limited time—shop now and make the most of these amazing offers before they disappear!",
    bannerImg:
      "https://i.postimg.cc/BbWMJ8s6/pexels-tamanna-rumee-52377920-7987758-1.jpg",
  },
];

const HeroBanner = () => {
  const { data: categoryData, isLoading: categoryDataLoading } =
    useGetAllCategoryQuery(undefined);

  const [categoryOptions, setCategoryOptions] = useState<TCategoryOption[]>([]);

  //   ! effect for get category data
  useEffect(() => {
    if (categoryData?.data) {
      const modifiedData = categoryData?.data?.map((item: TCategory) => {
        const optionValue = {
          name: item?.name,
          value: item?.id,
        };

        return optionValue;
      });

      const initialData: TCategoryOption = {
        name: "All",
        value: "",
      };

      setCategoryOptions([initialData, ...modifiedData]);
    }
  }, [categoryData?.data, categoryDataLoading]);

  return (
    <div className="heroBanner    py-8 bg-gray-50   ">
      <Wrapper className="  flex xmd:justify-between  flex-col xmd:flex-row gap-y-6 xmd:gap-y-0  ">
        {/* left category section starts  */}
        <div className="leftCategory  w-full xmd:w-[20%] h-full order-2 xmd:order-1  ">
          {/* category input starts  */}

          <div className="categoryInput bg-white w-full  xmd:w-auto  h-full shadow-md rounded border border-gray-300 py-2 px-4">
            <h1 className="font-medium mb-2 text-gray-800">Category :</h1>
            <ul className="text-sm font-medium text-gray-800">
              {categoryOptions &&
                categoryOptions?.map(
                  (item: { name: string; value: string }, ind: number) => (
                    <li key={ind} className="w-full border-b border-gray-300">
                      <Link to={`/products?ParamCategory=${item?.value}`}>
                        <p className="  ml-6 py-2  ">{item?.name}</p>
                      </Link>
                    </li>
                  )
                )}
            </ul>
          </div>
          {/* *  category input  ends   */}
        </div>

        {/* right banner section  */}
        <div className="heroBannerContainer  w-full xmd:w-[80%]  order-1 ">
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            modules={[Autoplay, Pagination]}
            className="mySwiper"
          >
            {bannerInfo &&
              bannerInfo.map((banner, ind) => (
                <SwiperSlide key={ind}>
                  <HeroBannerCard key={ind} banner={banner} />
                </SwiperSlide>
              ))}
          </Swiper>
          {/* <HeroBannerCard /> */}
        </div>
      </Wrapper>
    </div>
  );
};

export default HeroBanner;
