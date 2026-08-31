import axios from "axios";
import { toast } from "sonner";
import { getCookies } from "@/utils/GetCookies";
import { getBaseUrl } from "@/config/envConfig";
import { authKey } from "@/constants/storageKey";
import { decodeToken } from "./tokenUtils";
import { useAuthStore } from "@/stores/useAuthStore";

const instance = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});

instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.timeout = 60000;

// Request interceptor
instance.interceptors.request.use(
  function (config) {
    // <========
    // If the request is a POST request and the data is not FormData,
    // set Content-Type to application/json
    // ========>
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    } else {
      // Let the browser set the correct multipart boundary
      config.headers["Content-Type"] = "multipart/form-data";
    }

    // Skip adding Authorization header for login endpoint
    if (!config.url?.includes("/auth/log-in")) {
      const accessToken = getCookies(authKey);
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// Shared by concurrent 401s so a burst of requests triggers exactly one refresh call
let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = async (): Promise<string> => {
  const response = await axios.post(
    `${getBaseUrl()}/auth/refresh-token`,
    undefined,
    { withCredentials: true },
  );

  const newAccessToken: string = response?.data?.data?.accessToken;

  if (!newAccessToken) {
    throw new Error("No access token returned from refresh");
  }

  const user = decodeToken(newAccessToken);
  if (user) {
    useAuthStore.getState().setAuth(user, newAccessToken);
  }

  return newAccessToken;
};

instance.interceptors.response.use(
  // ✅ Handle success
  //@ts-expect-error: response type is not always consistent
  function (response) {
    return {
      data: response?.data,
      meta: response?.data?.meta,
    };
  },

  // ❌ Handle errors
  async function (error) {
    const originalRequest = error.config;

    // console.log("-----");
    // console.log("-----");
    // console.log("line = 64");
    // console.log("error from axiosInstance = ", error);
    // console.log("-----");
    // console.log("-----");

    // !
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        }

        const newAccessToken = await refreshPromise;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure
        useAuthStore.getState().logout();
        toast.error("Session Expired , Login to continue.");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }
    // !

    // Handle 403
    if (error?.response?.status === 403) {
      toast.error("You do not have permission to access this resource");
      return Promise.reject(error);
    }

    // Generic Error Handler
    const errorObj = {
      statusCode: error?.response?.data?.statusCode || 500,
      message: error?.response?.data?.message || "Something went wrong",
      errorMessages: error?.response?.data?.message,
      errors: error?.response?.data?.errors,
    };

    // toast.error("Session Expired , Login to continue.");

    // console.log("errorObj = ", errorObj);

    // toast.error(errorObj.message);
    return Promise.reject(errorObj);
  },
);
export { instance as axiosInstance };
