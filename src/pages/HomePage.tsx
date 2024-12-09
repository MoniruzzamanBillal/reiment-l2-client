import {
  FlashSaleBanner,
  HeroBanner,
  HomeProducts,
  ShopByCategory,
} from "@/components/ui/home";

const HomePage = () => {
  return (
    <div className="HomePageContainer">
      <HeroBanner />
      <ShopByCategory />
      <HomeProducts />
      <FlashSaleBanner />
    </div>
  );
};

export default HomePage;
