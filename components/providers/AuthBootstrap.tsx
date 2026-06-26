"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { authKey } from "@/utils/constants/storageKey";
import { useAuthStore } from "@/stores/useAuthStore";
import { decodeToken } from "@/utils/tokenUtils";

export function AuthBootstrap() {
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const token = Cookies.get(authKey);
    if (token) {
      const user = decodeToken(token);
      if (user) setAuth(user, token);
    }
  }, [setAuth]);

  return null;
}
