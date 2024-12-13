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

    //
  }),
});

//
export const { useFollowShopMutation, useUnfollowShopMutation } = followerApi;
