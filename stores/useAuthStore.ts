"use client";

import { create } from "zustand";
import Cookies from "js-cookie";
import {
  authKey,
  refreshTokenKey,
  userIdKey,
} from "@/utils/constants/storageKey";
import { TUser } from "@/types";

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
    Cookies.remove(authKey);
    Cookies.remove(refreshTokenKey);
    Cookies.remove(userIdKey);
    set({ user: null, token: null });
  },
}));
