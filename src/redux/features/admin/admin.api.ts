import { baseApi } from "@/redux/api/baseApi";

const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //
    // ! for getting admin stats
    getAdminStats: builder.query({
      query: () => {
        return {
          url: "/admin/stats",
          method: "GET",
        };
      },
    }),

    //
  }),
});

//

export const { useGetAdminStatsQuery } = adminApi;
