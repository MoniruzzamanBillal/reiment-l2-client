import { baseApi } from "@/redux/api/baseApi";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //! for getting vendor shop's product
    getVendorShopProducts: builder.query({
      query: (id: string) => {
        return {
          url: `/product/get-vendor-product/${id}`,
          method: "GET",
        };
      },
      providesTags: ["getVendorShopProduct"],
    }),

    // ! for getting single product
    getSingleProducts: builder.query({
      query: (id: string) => {
        return {
          url: `/product/get-product/${id}`,
          method: "GET",
        };
      },
      providesTags: ["getSingleProduct"],
    }),

    //
  }),
});

export const { useGetVendorShopProductsQuery, useGetSingleProductsQuery } =
  productApi;
