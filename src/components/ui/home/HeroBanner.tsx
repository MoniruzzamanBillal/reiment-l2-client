import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Wrapper from "@/components/shared/Wrapper";
import { Heart, ShoppingBag, Users, Zap } from "lucide-react";
import { ReactNode } from "react";
import { Autoplay, Pagination } from "swiper/modules";
import HeroBannerCard from "./HeroBannerCard";

export type TBanner = {
  subHeading: string;
  heading: string;
  description: string;
  bannerImg: string;
  primaryCTA: string;
  secondaryCTA?: string;
};

type TBottomInfo = {
  id: number;
  icnon: ReactNode;
  subHeading: string;
  subPara: string;
};

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
      "Get ready to save big! Explore our exclusive collection of premium products with irresistible discounts and limited-time offers. Don't miss out—grab your favorites before they're gone!",
    bannerImg:
      "https://i.postimg.cc/x872MmFp/pexels-imin-technology-276315592-12935091.jpg",
    primaryCTA: "View Deals",
    secondaryCTA: "Browse Products",
  },
  {
    subHeading: "Your Dream Products Are Just a Click Away",
    heading: "Find Everything You Love, All in One Place",
    description:
      "Whether you're upgrading your wardrobe, enhancing your home, or picking up essentials, we've got you covered. Browse, compare, and buy with ease.",
    bannerImg:
      "https://i.postimg.cc/HLXmpM1c/pexels-vlada-karpovich-4050388-1.jpg",
    primaryCTA: "Shop Now",
    secondaryCTA: "Learn More",
  },
  {
    subHeading: "Follow Your Favorite Shops",
    heading: "Get Personalized Recommendations",
    description:
      "Follow your favorite shops and stay updated with their latest collections and exclusive deals. Discover products handpicked just for you and elevate your shopping game.",
    bannerImg: "https://i.postimg.cc/26r8SnP4/pexels-quintingellar-696205.jpg",
    primaryCTA: "Discover Shops",
    secondaryCTA: "Sign Up Free",
  },
  {
    subHeading: "Flash Sales Every Day!",
    heading: "Don't Miss Out on Today's Best Deals",
    description:
      "Enjoy incredible discounts during our daily flash sales. Limited products, limited time—shop now and make the most of these amazing offers before they disappear!",
    bannerImg:
      "https://i.postimg.cc/BbWMJ8s6/pexels-tamanna-rumee-52377920-7987758-1.jpg",
    primaryCTA: "Shop Flash Sale",
    secondaryCTA: "Set Alert",
  },
];

const bottomSectionInfo: TBottomInfo[] = [
  {
    id: 1,
    icnon: <ShoppingBag className="w-6 h-6 text-prime100" />,
    subHeading: "Multi-Vendor Marketplace",
    subPara: "Shop from thousands of trusted vendors",
  },
  {
    id: 2,
    icnon: <Zap className="w-6 h-6 text-prime100" />,
    subHeading: "Lightning Fast",
    subPara: "Quick delivery and seamless experience",
  },
  {
    id: 3,
    icnon: <Heart className="w-6 h-6 text-prime100" />,
    subHeading: "Customer First",
    subPara: "24/7 support and satisfaction guarantee",
  },
  {
    id: 4,
    icnon: <Users className="w-6 h-6 text-prime100" />,
    subHeading: "Join Community",
    subPara: "Connect with vendors and shoppers",
  },
];

const HeroBanner = () => {
  return (
    <div className="heroBanner relative pt-14 pb-8 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <Wrapper className="relative ">
        {/* Main banner carousel */}
        <div className="heroBannerContainer w-full">
          <Swiper
            spaceBetween={0}
            centeredSlides={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            modules={[Autoplay, Pagination]}
            className="mySwiper rounded-2xl  shadow"
          >
            {bannerInfo &&
              bannerInfo.map((banner, ind) => (
                <SwiperSlide key={ind}>
                  <HeroBannerCard banner={banner} />
                </SwiperSlide>
              ))}
          </Swiper>
        </div>

        {/* Bottom features */}
        <div className="mt-5  mx-auto w-[80%] xsm:w-full grid grid-cols-1 xsm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bottomSectionInfo &&
            bottomSectionInfo?.map((info: TBottomInfo) => (
              <div
                key={info?.id}
                className="text-center p-6 bg-gray-200/70 border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-prime100/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  {info?.icnon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  {info?.subHeading}
                </h3>
                <p className="text-sm text-gray-600">{info?.subPara}</p>
              </div>
            ))}
        </div>
      </Wrapper>
    </div>
  );
};

export default HeroBanner;
