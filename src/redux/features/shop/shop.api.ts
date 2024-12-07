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
    }),

    //
  }),
});

export const { useGetAllShopDataQuery } = shopApi;
