export type TVendorStats = {
  statsData: { value: number; title: string }[];
  revenueDatas: { month: string; revenue: number; orders: number }[];
  topProducts: {
    productId: string;
    name: string;
    quantity: number;
    revenue: number;
  }[];
  orderStatusBreakdown: { status: string; count: number }[];
};
