import { ReactNode } from "react";

export type TUser = {
  userId: string;
  userEmail: string;
  userRole: string;
  role: string;
  iat: number;
  exp: number;
};

export type TDashboardLinks = {
  name: string;
  path: string;
  icon: ReactNode;
};

// ! home , product page data response type
export type TProductResponse = {
  id: string;
  shopId: string;
  categoryId: string;
  name: string;
  price: number;
  description: string;
  inventoryCount: number;
  discount: number | null;
  productImg: string | null;

  shop: {
    id: string;
    vendorId: string;
    name: string;
    logo: string;
    description: string;
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  };
  category: {
    id: string;
    name: string;
  };
};

// ! type for product detail
export type TProductDetail = {
  id: string;
  shopId: string;
  categoryId: string;
  name: string;
  price: number;
  description: string;
  inventoryCount: number;
  discount: number | null;
  productImg: string | null;

  category: {
    id: string;
    name: string;
    categoryImg?: string;
  };
  shop: {
    id: string;
    vendorId: string;
    name: string;
    logo: string;
    description: string;
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  };
  review: TProductDetailReview[];
};

type TProductDetailReview = {
  id: string;
  orderItemId: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  user: {
    id: string;
    username: string;
    email: string;
    password: string;
    profileImg: string | null;
    role: "CUSTOMER" | "VENDOR" | "ADMIN";
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  };
};

export type TShopDetail = {
  id: string;
  vendorId: string;
  name: string;
  logo: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};
