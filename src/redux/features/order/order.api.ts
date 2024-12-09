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

    //
  }),
});

//
export const { useOrderItemMutation } = orderApi;
