import { TCartItem } from "@/types";

export const calculateCartPrice = (items: TCartItem[] | undefined): number => {
  if (!items) return 0;
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};
