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

    //
  }),
});

//
export const {
  useCheckEligibleForReviewQuery,
  useGiveReviewMutation,
  useGetVendorProductReviewsQuery,
} = reviewApi;
