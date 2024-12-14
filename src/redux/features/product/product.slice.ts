import { createSlice } from "@reduxjs/toolkit";

type TProduct = {
  id: string;
  name: string;
  price?: number;
  categoryId?: string;
  description?: string;
  inventoryCount?: number;
  discount?: number;
  productImg?: string;
};

type TComparisonState = {
  products: TProduct[];
};

const initialState: TComparisonState = {
  products: [],
};

const comparisonSlice = createSlice({
  name: "comparison",
  initialState,
  reducers: {
    // add product to comparison
    addToComparison: (state, action) => {
      const product = action.payload;
      const existingCategoryId =
        state?.products?.length > 0 ? state?.products[0]?.categoryId : null;

      // Ensure the same category and limit to three products
      if (
        (existingCategoryId === null ||
          existingCategoryId === product.categoryId) &&
        state.products.length < 3 &&
        !state.products.some((p) => p.id === product.id)
      ) {
        state.products.push(product);
      }
    },

    // remove product from comparison
    removeFromComparison: (state, action) => {
      state.products = state?.products?.filter(
        (product) => product?.id !== action?.payload
      );
    },
    clearComparison(state) {
      state.products = [];
    },

    //
  },
});

//
export const { addToComparison, removeFromComparison, clearComparison } =
  comparisonSlice.actions;
export default comparisonSlice.reducer;
