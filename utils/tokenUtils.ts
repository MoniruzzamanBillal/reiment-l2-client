import { jwtDecode } from "jwt-decode";
import { TUser } from "@/types";

export const decodeToken = (token: string): TUser | null => {
  try {
    return jwtDecode<TUser>(token);
  } catch {
    return null;
  }
};
