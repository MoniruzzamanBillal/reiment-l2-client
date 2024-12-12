type TCustomerShop = {
  id: string;
  vendorId: string;
  name: string;
  logo: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
};

type TCustomerCategory = {
  id: string;
  name: string;
  categoryImg: string | null;
};

export type TCustomerProduct = {
  id: string;
  name: string;
  price: number;
  description: string;
  inventoryCount: number;
  discount: number | null;
  productImg: string;
  categoryId: string;
  category: TCustomerCategory;
  shopId: string;
  shop: TCustomerShop;
};
