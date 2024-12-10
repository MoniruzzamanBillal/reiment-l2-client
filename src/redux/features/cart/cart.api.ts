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
          url: "/cart/add-to-cart",
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
          url: "/cart/replace-cart",
          method: "PATCH",
          body: payload,
        };
      },
      invalidatesTags: ["getUserCart"],
    }),

    // ! for increasing cart item quantity
    increaseCartItemQuantity: builder.mutation({
      query: (payload) => {
        return {
          url: "/cart/increase-item-quantity",
          method: "PATCH",
          body: payload,
        };
      },
      invalidatesTags: ["getUserCart"],
    }),

    // ! for decreasing cart item quantity
    decreaseCartItemQuantity: builder.mutation({
      query: (payload) => {
        return {
          url: "/cart/decrease-item-quantity",
          method: "PATCH",
          body: payload,
        };
      },
      invalidatesTags: ["getUserCart"],
    }),

    // ! for deleting cart item quantity
    deleteCartItem: builder.mutation({
      query: (payload) => {
        return {
          url: "/cart/delete-cart-item",
          method: "DELETE",
          body: payload,
        };
      },
      invalidatesTags: ["getUserCart"],
    }),

    //
  }),
});

export const {
  useGetUserCartQuery,
  useAddProductToCartMutation,
  useReplaceCartMutation,
  useIncreaseCartItemQuantityMutation,
  useDecreaseCartItemQuantityMutation,
  useDeleteCartItemMutation,
} = cartApi;
