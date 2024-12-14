import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination } from "swiper/modules";
import HeroBannerCard from "./HeroBannerCard";

export type TBanner = {
  subHeading: string;
  heading: string;
  description: string;
  bannerImg: string;
};

const bannerInfo: TBanner[] = [
  {
    subHeading: "Shop Smarter, Live Better",
    heading: "Unleash the Joy of Seamless Shopping",
    description:
      "Discover an exciting range of products tailored to your needs. From trendy fashion to must-have gadgets, shop now and enjoy unbeatable deals, fast delivery, and a hassle-free shopping experience. Start your journey today!",
    bannerImg:
      "https://i.postimg.cc/9XytS2BK/1000-F-249501466-n-LFWWk-Fb-KW2oi-OA5-FU1p5hjk0o-Qki-Uk-M.jpg",
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
    bannerImg: "https://i.postimg.cc/DwRSnJvg/slider-three-cover.png",
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
      "https://i.postimg.cc/L5ktZkX2/flash-sale-banner-with-red-background-and-limited-offer-vector.jpg",
  },
];

const HeroBanner = () => {
  return (
    <div className="heroBannerContainer py-8 ">
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
            <SwiperSlide>
              <HeroBannerCard key={ind} banner={banner} />
            </SwiperSlide>
          ))}
      </Swiper>
      {/* <HeroBannerCard /> */}
    </div>
  );
};

export default HeroBanner;
