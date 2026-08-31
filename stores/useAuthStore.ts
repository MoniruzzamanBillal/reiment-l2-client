"use client";

import { create } from "zustand";
import Cookies from "js-cookie";
import {
  authKey,
  refreshTokenKey,
  userIdKey,
} from "@/constants/storageKey";
import { TUser } from "@/types";
import { axiosInstance } from "@/lib/axiosInstance";

type TAuthState = {
  user: TUser | null;
  token: string | null;
  setAuth: (user: TUser, token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<TAuthState>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => set({ user, token }),
  logout: () => {
    // best-effort: the refreshToken cookie is httpOnly, so client JS can never
    // clear it directly — only the server can, via Set-Cookie
    axiosInstance.post("/auth/logout", {}).catch(() => {});
    Cookies.remove(authKey);
    Cookies.remove(refreshTokenKey);
    Cookies.remove(userIdKey);
    set({ user: null, token: null });
  },
}));
