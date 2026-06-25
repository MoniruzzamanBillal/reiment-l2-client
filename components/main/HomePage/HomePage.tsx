"use client";

import CustomerTestimonials from "./CustomerTestimonials";
import FeaturedVendor from "./FeaturedVendor";
import FlashSaleBanner from "./FlashSaleBanner";
import HeroBanner from "./HeroBanner";
import HomeProducts from "./HomeProducts";
import NewArrival from "./NewArrival";
import RecentReview from "./RecentReview";
import ShopByCategory from "./ShopByCategory";
import WhyChooseUs from "./WhyChooseUs";

export default function HomePage() {
  return (
    <div>
      <HeroBanner />
      <FlashSaleBanner />
      <ShopByCategory />
      <NewArrival />
      <HomeProducts />
      <FeaturedVendor />
      <WhyChooseUs />
      <RecentReview />
      <CustomerTestimonials />
    </div>
  );
}
