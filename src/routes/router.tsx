import App from "@/App";
import {
  AdminStatistics,
  Dashboard,
  DashboardLayout,
  Login,
  ManageCategory,
  ManageShop,
  ManageUsers,
  ManageVendorProduct,
  ManageVendorShop,
  MonitorReview,
  MonitorTransaction,
  VendorCustomerReview,
  VendorOderHistory,
} from "@/pages";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/dashboard/admin/manage-user",
            element: <ManageUsers />,
          },
          {
            path: "/dashboard/admin/manage-shop",
            element: <ManageShop />,
          },
          {
            path: "/dashboard/admin/categories",
            element: <ManageCategory />,
          },
          {
            path: "/dashboard/admin/statistics",
            element: <AdminStatistics />,
          },
          {
            path: "/dashboard/admin/monitor-transaction",
            element: <MonitorTransaction />,
          },
          {
            path: "/dashboard/admin/monitor-review",
            element: <MonitorReview />,
          },
          {
            path: "/dashboard/vendor/manage-shop",
            element: <ManageVendorShop />,
          },
          {
            path: "/dashboard/vendor/manage-products",
            element: <ManageVendorProduct />,
          },
          {
            path: "/dashboard/vendor/manage-products",
            element: <ManageVendorProduct />,
          },
          {
            path: "/dashboard/vendor/order-history",
            element: <VendorOderHistory />,
          },
          {
            path: "/dashboard/vendor/monitor-reviews",
            element: <VendorCustomerReview />,
          },
        ],
      },
    ],
  },
]);

export default router;
