import { TProductResponse, TShopDetail } from "@/types";

export type TFollower = { shopId: string };

export type TShopDetailWithProducts = TShopDetail & {
  Products: TProductResponse[];
  follower: TFollower[];
};
