import { baseApi } from "@/redux/api/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ! for getting all user
    getUser: builder.query({
      query: () => {
        return {
          url: "/user/all-user",
          method: "GET",
        };
      },
    }),

    // ! get loggedIn user
    getLoggedInUser: builder.query({
      query: () => {
        return {
          url: "/user/logged-user",
          method: "GET",
        };
      },
    }),

    //
  }),
});

export const { useGetUserQuery, useGetLoggedInUserQuery } = userApi;
