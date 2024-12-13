import { useAppSelector } from "@/redux/hook";

export const UseGetUser = () => {
  const { user } = useAppSelector((state) => state.auth);

  return user;
};

// ! for getting recent products lists
export const UseGetRecentProducts = () => {
  const { recentProducts } = useAppSelector((state) => state.recentProduct);

  return recentProducts;
};
