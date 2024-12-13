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
      query: (param) => {
        return {
          url: `/product/all-products`,
          method: "GET",
          params: param,
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
      invalidatesTags: [
        "getAllProducts",
        "getSingleProduct",
        "getVendorShopProduct",
      ],
    }),

    // ! for duplicating product
    duplicateProduct: builder.mutation({
      query: (payload) => {
        return {
          url: `/product/duplicate-product`,
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

    // ! for getting flash sale  products
    getFlashSaleProduct: builder.query({
      query: () => {
        return {
          url: `/product/flashsale-products`,
          method: "GET",
        };
      },
      providesTags: ["getAllflashsaleProducts"],
    }),

    // ! for getting recent products
    getRecentProducts: builder.query({
      query: (payload) => {
        return {
          url: `/product/recent-products`,
          method: "PATCH",
          body: payload,
        };
      },
    }),

    // ! for getting related product
    getRelatedProduct: builder.query({
      query: (categoryId: string) => {
        return {
          url: `/product/get-related-products/${categoryId}`,
          method: "GET",
        };
      },
      providesTags: ["relatedProducts"],
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
  useDuplicateProductMutation,
  useGetFlashSaleProductQuery,
  useGetRelatedProductQuery,
  useGetRecentProductsQuery,
} = productApi;
