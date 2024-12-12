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

    //
  }),
});

//
export const { useLogInMutation, useSignUpMutation, useUpdateUserMutation } =
  authApi;
