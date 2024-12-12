type TVendorShop = {
  id: string;
  vendorId: string;
  name: string;
  logo: string | null;
  description: string;
};

type TVendorCategory = {
  id: string;
  name: string;
  categoryImg: string | null;
  isDelated: boolean;
};

export type TVendorProduct = {
  id: string;
  name: string;
  price: number;
  description: string;
  inventoryCount: number;
  discount: number | null;
  productImg: string | null;
  isDelated: boolean;
  createdAt: string;
  updatedAt: string;
  shopId: string;
  shop: TVendorShop;
  categoryId: string;
  category: TVendorCategory;
};
