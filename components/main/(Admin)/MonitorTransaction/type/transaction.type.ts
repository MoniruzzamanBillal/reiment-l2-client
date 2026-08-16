export type TTransaction = {
  id: string;
  customer: { username: string };
  trxnNumber: string;
  totalPrice: number;
  createdAt: string;
};
