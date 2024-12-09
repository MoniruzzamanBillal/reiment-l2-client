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

    // ! for getting all products
    getAllProduct: builder.query({
      query: () => {
        return {
          url: `/product/all-products`,
          method: "GET",
        };
      },
      providesTags: ["getAllProducts"],
    }),

    // ! for adding product
    addProduct: builder.mutation({
      query: (payload) => {
        return {
          url: `/product/add-product`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: [
        "getAllProducts",
        "getSingleProduct",
        "getVendorShopProduct",
      ],
    }),

    // ! for updating product
    updateProduct: builder.mutation({
      query: ({ formData, id }) => {
        return {
          url: `/product/update-product/${id}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: [
        "getAllProducts",
        "getSingleProduct",
        "getVendorShopProduct",
      ],
    }),

    // ! for deleting a product
    deleteProduct: builder.mutation({
      query: (id: string) => {
        return {
          url: `/product/delete-product/${id}`,
          method: "PATCH",
        };
      },
    }),

    //
  }),
});

export const {
  useGetVendorShopProductsQuery,
  useGetSingleProductsQuery,
  useGetAllProductQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
