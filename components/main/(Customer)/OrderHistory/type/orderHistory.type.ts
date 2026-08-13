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
