import { baseApi } from "@/redux/api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ! for register
    signUp: builder.mutation({
      query: (payload) => {
        return {
          url: "/auth/create-user",
          method: "POST",
          body: payload,
        };
      },
    }),

    // ! for login
    logIn: builder.mutation({
      query: (payload) => {
        return {
          url: "/auth/log-in",
          method: "POST",
          body: payload,
        };
      },
    }),

    // ! for updating a user
    updateUser: builder.mutation({
      query: (payload) => {
        return {
          url: "/auth/update-user",
          method: "PATCH",
          body: payload,
        };
      },
      invalidatesTags: ["getLoggedInUser"],
    }),

    // ! for deleting a user
    deleteUser: builder.mutation({
      query: (payload) => {
        return {
          url: "/auth/delete-user",
          method: "PATCH",
          body: payload,
        };
      },
    }),

    // ! for unblocking a user
    unblockUser: builder.mutation({
      query: (payload) => {
        return {
          url: "/auth/unblock-user",
          method: "PATCH",
          body: payload,
        };
      },
    }),

    // ! for blocking vendor shop
    blockVendor: builder.mutation({
      query: (payload) => {
        return {
          url: "/auth/block-vendor-shop",
          method: "PATCH",
          body: payload,
        };
      },
    }),

    // ! for unblocking vendor shop
    unblockVendor: builder.mutation({
      query: (payload) => {
        return {
          url: "/auth/unblock-vendor-shop",
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
  useLogInMutation,
  useSignUpMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUnblockUserMutation,
  useBlockVendorMutation,
  useUnblockVendorMutation,
} = authApi;
