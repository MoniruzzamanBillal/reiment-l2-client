// ! main base url
// export const baseURL = "http://localhost:5000";
// export const baseURL = "http://localhost:3000";
export const baseURL = "https://reiment-l2-server.vercel.app";

export const getBaseUrl = (): string => {
  return `${baseURL}/api`
  // return process.env.NEXT_PUBLIC_API_BASE_URL || `${baseURL}/api`;
};
