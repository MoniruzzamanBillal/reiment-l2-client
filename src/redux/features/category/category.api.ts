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

    // ! for getting single category data
    getSingleCategory: builder.query({
      query: (id: string) => {
        return {
          url: `/category/category/${id}`,
          method: "GET",
        };
      },
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

    // ! for updating a category
    updateCategory: builder.mutation({
      query: (payload) => {
        const { id, data } = payload;
        return {
          url: `/category/update-category/${id}`,
          method: "PATCH",
          body: data,
        };
      },
    }),

    //
  }),
});

export const {
  useGetAllCategoryQuery,
  useAddCategoryMutation,
  useGetSingleCategoryQuery,
  useUpdateCategoryMutation,
} = categoryApi;
