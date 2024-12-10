import { baseApi } from "@/redux/api/baseApi";

const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ! for getting user cart data
    getUserCart: builder.query({
      query: () => {
        return {
          url: "/cart/my-cart",
          method: "GET",
        };
      },
      providesTags: ["getUserCart"],
    }),

    // ! add product to cart ( direct )
    addProductToCart: builder.mutation({
      query: (payload) => {
        return {
          url: "cart/add-to-cart",
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["getUserCart"],
    }),

    // ! for replace cart
    replaceCart: builder.mutation({
      query: (payload) => {
        return {
          url: "cart/replace-cart",
          method: "PATCH",
          body: payload,
        };
      },
    }),

    //
  }),
});

export const {
  useGetUserCartQuery,
  useAddProductToCartMutation,
  useReplaceCartMutation,
} = cartApi;
