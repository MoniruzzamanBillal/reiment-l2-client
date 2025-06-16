// User
type TUser = {
  id: string;
  username: string;
  email: string;
  password: string;
  profileImg: string;
  phoneNumber?: string;
  address?: string;
};

// Review
export type TReview = {
  id: string;
  comment: string;
  rating: number;
  isDeleted: boolean;
  userId: string;
  productId: string;
  orderItemId: string;
  user: TUser;
};

// Category
type TCategory = {
  id: string;
  name: string;
  categoryImg: string;
  isDelated: boolean;
};

// Shop
type TShop = {
  id: string;
  vendorId: string;
  name: string;
  logo: string;
  description: string;
  address?: string;
};

// Product
export type TProductDetailType = {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  inventoryCount: number;
  productImg: string;
  isDelated: boolean;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  shopId: string;

  // populated fields
  category: TCategory;
  review: TReview[];
  shop: TShop;
};
