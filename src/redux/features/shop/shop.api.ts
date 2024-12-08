import { baseApi } from "@/redux/api/baseApi";

const shopApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //  ! for getting all shop data
    getAllShopData: builder.query({
      query: () => {
        return {
          url: "/shop/all-shop-data",
          method: "GET",
        };
      },
      providesTags: ["getAllShop"],
    }),

    // ! for crating a shop
    addShop: builder.mutation({
      query: (payload) => {
        return {
          url: "/shop/create-shop",
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["getVendorShop"],
    }),

    // ! for getting vendor shop
    getVendorShop: builder.query({
      query: () => {
        return {
          url: "/shop/vendor-shop",
          method: "GET",
        };
      },
      providesTags: ["getVendorShop"],
    }),

    //
  }),
});

export const {
  useGetAllShopDataQuery,
  useAddShopMutation,
  useGetVendorShopQuery,
} = shopApi;