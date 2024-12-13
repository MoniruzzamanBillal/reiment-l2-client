import { createSlice } from "@reduxjs/toolkit";

type TInitialState = {
  recentProducts: string[]; // Array to store product IDs
};

const initialState: TInitialState = {
  recentProducts: [],
};

const recentProductSlice = createSlice({
  name: "recentProduct",
  initialState,
  reducers: {
    // Add a product ID to the recent products lists
    addRecentProduct: (state, action) => {
      const productId = action.payload;

      if (!state.recentProducts.includes(productId)) {
        state.recentProducts.push(productId);
      }

      if (state.recentProducts.length > 10) {
        state.recentProducts.shift();
      }
    },

    // Clear all recent products
    clearRecentProducts: (state) => {
      state.recentProducts = [];
    },
  },
});

//
export const { addRecentProduct, clearRecentProducts } =
  recentProductSlice.actions;
export default recentProductSlice.reducer;
