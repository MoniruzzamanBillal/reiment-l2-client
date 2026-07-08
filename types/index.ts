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

export type TProductDetailReview = {
  id: string;
  orderItemId: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
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

export type TShopDetail = {
  id: string;
  vendorId: string;
  name: string;
  logo: string;
  description: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  createdAt: string;
  updatedAt: string;
};

export type TCategory = {
  id: string;
  name: string;
  categoryImg: string | null;
};

export type TVendorProduct = {
  id: string;
  shopId: string;
  categoryId: string;
  name: string;
  price: number;
  description: string;
  inventoryCount: number;
  discount: number | null;
  productImg: string | null;
  isDeleted: boolean;
  category: {
    id: string;
    name: string;
  };
  shop: {
    id: string;
    name: string;
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  };
};

export type TVendorShop = {
  id: string;
  vendorId: string;
  name: string;
  logo: string;
  description: string;
  status: "ACTIVE" | "BLOCKED";
};

export type TCustomerProduct = {
  id: string;
  name: string;
  price: number;
  productImg: string | null;
  discount: number | null;
};

export type TRelatedProduct = {
  id: string;
  name: string;
  price: number;
  productImg: string | null;
  discount: number | null;
  categoryId: string;
};

export type TReview = {
  id: string;
  orderItemId: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    id: string;
    username: string;
    email: string;
    profileImg: string | null;
  };
  product?: {
    id: string;
    name: string;
    productImg: string | null;
  };
};

export type TComparisonProduct = {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  description: string;
  inventoryCount: number;
  discount: number | null;
  productImg: string | null;
};

export type TCartItem = {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    productImg: string | null;
    price: number;
    discount: number | null;
    inventoryCount: number;
    shopId: string;
  };
};

export type TCart = {
  id: string;
  customerId: string;
  vendorId: string;
  cartItem: TCartItem[];
};

export type TOrderItem = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  isReviewed: boolean;
  product: {
    id: string;
    name: string;
    productImg: string | null;
  };
};

export type TOrderHistory = {
  id: string;
  customerId: string;
  totalPrice: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  trxnNumber: string;
  createdAt: string;
  updatedAt: string;
  orderItem: TOrderItem[];
};

export type TAdminUser = {
  id: string;
  username: string;
  email: string;
  profileImg: string | null;
  role: "ADMIN" | "VENDOR" | "CUSTOMER";
  status: "ACTIVE" | "BLOCKED" | "SUSPENDED";
  createdAt: string;
};

export type TAdminShop = {
  id: string;
  vendorId: string;
  name: string;
  logo: string;
  description: string;
  status: "ACTIVE" | "BLOCKED";
  vendor: {
    id: string;
    username: string;
    email: string;
  };
};

export type TAdminStats = {
  statsData: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
    totalShops: number;
  };
  revenueDatas: {
    month: string;
    revenue: number;
    orders: number;
  }[];
  categoryDataPercentage: {
    name: string;
    value: number;
  }[];
};

export type TCoupon = {
  id: string;
  code: string;
  discountValue: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
};

export type TFollowData = {
  id: string;
  customerId: string;
  shopId: string;
  shop: {
    id: string;
    name: string;
    logo: string;
  };
};

export type TLoggedInUser = {
  id: string;
  username: string;
  email: string;
  profileImg: string | null;
  role: "ADMIN" | "VENDOR" | "CUSTOMER";
  status: "ACTIVE" | "BLOCKED" | "SUSPENDED";
  needsPasswordChange: boolean;
};

export type TAiGenerateDescriptionResponse = {
  title: string;
  description: string;
};

export type TAiChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type TAiChatResponse = {
  reply: string;
  productIds: string[];
};
