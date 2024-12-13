import { baseApi } from "@/redux/api/baseApi";

const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ! for getting coupon
    getCoupon: builder.mutation({
      query: (payload) => {
        return {
          url: "/coupon/get-coupon",
          method: "POST",
          body: payload,
        };
      },
    }),

    //
  }),
});

//
export const { useGetCouponMutation } = couponApi;
