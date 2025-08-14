import {
  CustomerTestimonials,
  FeaturedVendor,
  FlashSaleBanner,
  HeroBanner,
  HomeProducts,
  NewArrival,
  RecentReview,
  ShopByCategory,
  WhyChooseUs,
} from "@/components/ui/home";
import { useEffect, useState } from "react";

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show the button when the user scrolls 100px down
  const toggleVisibility = () => {
    if (window.pageYOffset > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top functionality
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="HomePageContainer bg-gray-100 ">
      <HeroBanner />
      <FlashSaleBanner />

      <ShopByCategory />
      <NewArrival />
      <HomeProducts />
      <FeaturedVendor />
      <WhyChooseUs />
      <RecentReview />
      <CustomerTestimonials />
      {/* <TestPage /> */}

      {/* Scroll-to-top button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 size-[2.8rem]  bg-prime100 text-white rounded-md shadow-md hover:bg-prime200 transition-all text-xl "
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default HomePage;
