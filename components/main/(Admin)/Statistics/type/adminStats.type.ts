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
