import { baseApi } from "@/redux/api/baseApi";

const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ! for getting all coupon
    getAllCoupon: builder.query({
      query: () => {
        return {
          url: "/coupon/all-coupon",
          method: "GET",
        };
      },
    }),

    // ! for getting single  coupon
    getCoupon: builder.mutation({
      query: (payload) => {
        return {
          url: "/coupon/get-coupon",
          method: "POST",
          body: payload,
        };
      },
    }),

    // ! for adding coupon
    addCoupon: builder.mutation({
      query: (payload) => {
        return {
          url: "/coupon/add-coupon",
          method: "POST",
          body: payload,
        };
      },
    }),

    // ! for deleting coupon
    deleteCoupon: builder.mutation({
      query: (id: string) => {
        return {
          url: `/coupon/delete-coupon/${id}`,
          method: "PATCH",
        };
      },
    }),

    //
  }),
});

//
export const {
  useGetCouponMutation,
  useAddCouponMutation,
  useDeleteCouponMutation,
  useGetAllCouponQuery,
} = couponApi;
