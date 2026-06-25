"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TComparisonProduct } from "@/types";

type TComparisonState = {
  products: TComparisonProduct[];
  addToComparison: (product: TComparisonProduct) => void;
  removeFromComparison: (id: string) => void;
  clearComparison: () => void;
};

export const useComparisonStore = create<TComparisonState>()(
  persist(
    (set, get) => ({
      products: [],
      addToComparison: (product) => {
        const { products } = get();
        const existingCategoryId =
          products.length > 0 ? products[0].categoryId : null;

        if (
          (existingCategoryId === null ||
            existingCategoryId === product.categoryId) &&
          products.length < 3 &&
          !products.some((p) => p.id === product.id)
        ) {
          set({ products: [...products, product] });
        }
      },
      removeFromComparison: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
      clearComparison: () => set({ products: [] }),
    }),
    { name: "reiment_comparison" }
  )
);
