import { baseApi } from "@/redux/api/baseApi";

const followerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ! for following a shop
    followShop: builder.mutation({
      query: (payload) => {
        return {
          url: "/follow/follow-shop",
          method: "POST",
          body: payload,
        };
      },
    }),

    // ! for unfollowing a shop
    unfollowShop: builder.mutation({
      query: (payload) => {
        return {
          url: "/follow/unfollow-shop",
          method: "DELETE",
          body: payload,
        };
      },
    }),

    // ! for getting logged in follower data
    getLoggedUserFollowData: builder.query({
      query: () => {
        return {
          url: "/follow/logged-user-data",
          method: "GET",
        };
      },
    }),

    //
  }),
});

//
export const {
  useFollowShopMutation,
  useUnfollowShopMutation,
  useGetLoggedUserFollowDataQuery,
} = followerApi;
