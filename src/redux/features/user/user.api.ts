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

    //
  }),
});

export const { useGetUserQuery } = userApi;
