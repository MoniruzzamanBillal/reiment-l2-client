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

    //
  }),
});

export const { useGetUserCartQuery } = cartApi;
