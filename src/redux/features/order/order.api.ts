import { baseApi } from "@/redux/api/baseApi";

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //   ! for ordering items
    orderItem: builder.mutation({
      query: (payload) => {
        return {
          url: "/order/order-item",
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["getUserCart"],
    }),

    // ! for getting user order history
    getUserOrderHistory: builder.query({
      query: () => {
        return {
          url: "/order/user-order-history",
          method: "GET",
        };
      },
    }),

    //
  }),
});

//
export const { useOrderItemMutation, useGetUserOrderHistoryQuery } = orderApi;
