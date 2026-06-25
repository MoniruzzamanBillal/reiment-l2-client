export const UserRole = {
  ADMIN: "ADMIN",
  VENDOR: "VENDOR",
  CUSTOMER: "CUSTOMER",
} as const;

export type TUserRole = (typeof UserRole)[keyof typeof UserRole];
