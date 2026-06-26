"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type TCouponState = {
  couponId: string | null;
  setCouponId: (id: string) => void;
  resetCoupon: () => void;
};

export const useCouponStore = create<TCouponState>()(
  persist(
    (set) => ({
      couponId: null,
      setCouponId: (id) => set({ couponId: id }),
      resetCoupon: () => set({ couponId: null }),
    }),
    { name: "reiment_coupon" }
  )
);
