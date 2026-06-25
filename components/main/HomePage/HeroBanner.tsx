"use client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Wrapper from "@/components/shared/Wrapper";
import { Heart, ShoppingBag, Users, Zap } from "lucide-react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import HeroBannerCard, { TBanner } from "./HeroBannerCard";

const bannerInfo: TBanner[] = [
  {
    subHeading: "Shop Smarter, Live Better",
    heading: "Unleash the Joy of Seamless Shopping",
    description:
      "Discover an exciting range of products tailored to your needs. From trendy fashion to must-have gadgets, shop now and enjoy unbeatable deals, fast delivery, and a hassle-free shopping experience.",
    bannerImg: "https://i.postimg.cc/4yLk8bVM/pexels-asphotograpy-230544.jpg",
    primaryCTA: "Start Shopping",
    secondaryCTA: "Explore Categories",
  },
  {
    subHeading: "Exclusive Deals Await You",
    heading: "Shop the Best Products at Unmatched Prices",
    description:
      "Get ready to save big! Explore our exclusive collection of premium products with irresistible discounts and limited-time offers.",
    bannerImg:
      "https://i.postimg.cc/x872MmFp/pexels-imin-technology-276315592-12935091.jpg",
    primaryCTA: "View Deals",
    secondaryCTA: "Browse Products",
  },
  {
    subHeading: "Your Dream Products Are Just a Click Away",
    heading: "Find Everything You Love, All in One Place",
    description:
      "Whether you're upgrading your wardrobe, enhancing your home, or picking up essentials, we've got you covered.",
    bannerImg:
      "https://i.postimg.cc/HLXmpM1c/pexels-vlada-karpovich-4050388-1.jpg",
    primaryCTA: "Shop Now",
    secondaryCTA: "Learn More",
  },
  {
    subHeading: "Flash Sales Every Day!",
    heading: "Don't Miss Out on Today's Best Deals",
    description:
      "Enjoy incredible discounts during our daily flash sales. Limited products, limited time—shop now!",
    bannerImg:
      "https://i.postimg.cc/BbWMJ8s6/pexels-tamanna-rumee-52377920-7987758-1.jpg",
    primaryCTA: "Shop Flash Sale",
    secondaryCTA: "Set Alert",
  },
];

const bottomSectionInfo = [
  {
    id: 1,
    icon: <ShoppingBag className="w-6 h-6 text-prime100" />,
    subHeading: "Multi-Vendor Marketplace",
    subPara: "Shop from thousands of trusted vendors",
  },
  {
    id: 2,
    icon: <Zap className="w-6 h-6 text-prime100" />,
    subHeading: "Lightning Fast",
    subPara: "Quick delivery and seamless experience",
  },
  {
    id: 3,
    icon: <Heart className="w-6 h-6 text-prime100" />,
    subHeading: "Customer First",
    subPara: "24/7 support and satisfaction guarantee",
  },
  {
    id: 4,
    icon: <Users className="w-6 h-6 text-prime100" />,
    subHeading: "Join Community",
    subPara: "Connect with vendors and shoppers",
  },
];

const HeroBanner = () => {
  return (
    <div className="heroBanner relative pt-20 pb-10 bg-white overflow-hidden">
      <Wrapper className="relative">
        <div className="heroBannerContainer w-full">
          <Swiper
            spaceBetween={0}
            centeredSlides
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            modules={[Autoplay, Pagination]}
            className="mySwiper rounded-2xl shadow"
          >
            {bannerInfo.map((banner, ind) => (
              <SwiperSlide key={ind}>
                <HeroBannerCard banner={banner} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="mt-6 mx-auto w-[80%] xsm:w-full grid grid-cols-1 xsm:grid-cols-2 lg:grid-cols-4 gap-4">
          {bottomSectionInfo.map((info) => (
            <div
              key={info.id}
              className="text-center p-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-indigo-200 hover:shadow-md transition-all duration-200"
            >
              <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                {info.icon}
              </div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">
                {info.subHeading}
              </h3>
              <p className="text-xs text-gray-500">{info.subPara}</p>
            </div>
          ))}
        </div>
      </Wrapper>
    </div>
  );
};

export default HeroBanner;
