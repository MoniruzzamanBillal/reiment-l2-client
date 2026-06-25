"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type TRecentState = {
  recentProductIds: string[];
  addRecentProduct: (id: string) => void;
  clearRecentProducts: () => void;
};

export const useRecentProductsStore = create<TRecentState>()(
  persist(
    (set) => ({
      recentProductIds: [],
      addRecentProduct: (id) =>
        set((state) => {
          const filtered = state.recentProductIds.filter((p) => p !== id);
          const updated = [...filtered, id];
          return { recentProductIds: updated.slice(-10) };
        }),
      clearRecentProducts: () => set({ recentProductIds: [] }),
    }),
    { name: "reiment_recent" }
  )
);
