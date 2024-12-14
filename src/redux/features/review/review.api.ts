import { baseApi } from "@/redux/api/baseApi";

const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ! check eligible for review
    checkEligibleForReview: builder.query({
      query: (prodId: string) => {
        return {
          url: `/review/check-eligible-for-review/${prodId}`,
          method: "GET",
        };
      },
      providesTags: ["checkEligibleForReview"],
    }),

    // ! give review
    giveReview: builder.mutation({
      query: (payload) => {
        return {
          url: "/review/give-review",
          method: "POST",
          body: payload,
        };
      },
    }),

    // ! for getting vendor prosuct review
    getVendorProductReviews: builder.query({
      query: () => {
        return {
          url: `/review/getVendorProductReviews`,
          method: "GET",
        };
      },
    }),

    // ! for getting all review
    getAllReview: builder.query({
      query: () => {
        return {
          url: `/review/all-review`,
          method: "GET",
        };
      },
    }),

    // ! for updating review
    updateReview: builder.mutation({
      query: (payload) => {
        return {
          url: `/review/update-review`,
          method: "PATCH",
          body: payload,
        };
      },
    }),

    //
  }),
});

//
export const {
  useCheckEligibleForReviewQuery,
  useGiveReviewMutation,
  useGetVendorProductReviewsQuery,
  useGetAllReviewQuery,
  useUpdateReviewMutation,
} = reviewApi;
