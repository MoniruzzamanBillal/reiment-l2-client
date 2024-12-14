import {
  FlashSaleBanner,
  HeroBanner,
  HomeProducts,
  ShopByCategory,
} from "@/components/ui/home";
import { useGetLoggedInUserQuery } from "@/redux/features/user/user.api";

const HomePage = () => {
  const { data: userData } = useGetLoggedInUserQuery(undefined);

  // console.log(userData?.data?.follower);

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
