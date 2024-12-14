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

    // ! for getting vendor shop  order history
    getVendorOrderHistory: builder.query({
      query: () => {
        return {
          url: "/order/vendorShop-order-history",
          method: "GET",
        };
      },
    }),

    // ! get all order transaction data
    getAllTransactionData: builder.query({
      query: () => {
        return {
          url: "/order/all-transaction",
          method: "GET",
        };
      },
    }),

    //
  }),
});

//
export const {
  useOrderItemMutation,
  useGetUserOrderHistoryQuery,
  useGetVendorOrderHistoryQuery,
  useGetAllTransactionDataQuery,
} = orderApi;
