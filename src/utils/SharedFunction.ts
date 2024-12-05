import { useAppSelector } from "@/redux/hook";

export const UseGetUser = () => {
  const { user } = useAppSelector((state) => state.auth);

  return user;
};
