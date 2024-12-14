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
      <FlashSaleBanner />
      <ShopByCategory />
      <HomeProducts />
    </div>
  );
};

export default HomePage;
