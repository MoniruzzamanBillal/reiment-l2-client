import { baseApi } from "@/redux/api/baseApi";

const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ! for getting all category
    getAllCategory: builder.query({
      query: () => {
        return {
          url: "/category/all-category",
          method: "GET",
        };
      },
      providesTags: ["getAllCategory"],
    }),

    // ! for creating a category
    addCategory: builder.mutation({
      query: (payload) => {
        return {
          url: "/category/add-category",
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["getAllCategory"],
    }),

    //
  }),
});

export const { useGetAllCategoryQuery, useAddCategoryMutation } = categoryApi;
