/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { toast } from "sonner";
import { getBaseUrl } from "@/config/envConfig";
import { authKey } from "@/constants/storageKey";
import { getCookies } from "@/utils/GetCookies";

const extractErrorMessage = async (error: any) => {
  const fallback = "Failed to download file";
  const data = error?.response?.data;

  if (data instanceof Blob) {
    try {
      const text = await data.text();
      const parsed = JSON.parse(text);
      return parsed?.message || fallback;
    } catch {
      return fallback;
    }
  }

  return data?.message || fallback;
};

export const downloadFile = async (endpoint: string, filename: string) => {
  const toastId = toast.loading("Preparing download...");
  try {
    const accessToken = getCookies(authKey);

    const response = await axios.get(`${getBaseUrl()}${endpoint}`, {
      withCredentials: true,
      responseType: "blob",
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    toast.success("Download started", { id: toastId, duration: 1200 });
  } catch (err: any) {
    const message = await extractErrorMessage(err);
    toast.error(message, { id: toastId, duration: 1600 });
  }
};
