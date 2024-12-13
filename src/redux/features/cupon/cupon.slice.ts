import { createSlice } from "@reduxjs/toolkit";

type TInitialState = {
  cuponId: string | null;
};

const initialState: TInitialState = {
  cuponId: null,
};

const cuponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    // for setting cupon
    setCouponId: (state, action) => {
      const cuponId = action.payload;

      state.cuponId = cuponId;
    },

    // for reseting cupon id
    resetCoupon: (state) => {
      state.cuponId = null;
    },
  },
});

//
export const { setCouponId, resetCoupon } = cuponSlice.actions;
export default cuponSlice.reducer;
