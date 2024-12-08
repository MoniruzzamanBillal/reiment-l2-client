import App from "@/App";
import {
  AddCategory,
  AddShop,
  AdminStatistics,
  CustomerOrderHistory,
  Dashboard,
  DashboardLayout,
  FollowedShop,
  Login,
  ManageCategory,
  ManageShop,
  ManageUsers,
  ManageVendorProduct,
  ManageVendorShop,
  MonitorReview,
  MonitorTransaction,
  UpdateCategory,
  UpdateProfile,
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
            path: "/dashboard/update-profile/:id",
            element: <UpdateProfile />,
          },
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
            path: "/dashboard/admin/categories/add-category",
            element: <AddCategory />,
          },
          {
            path: "/dashboard/admin/categories/update-category/:id",
            element: <UpdateCategory />,
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
            path: "/dashboard/vendor/add-shop",
            element: <AddShop />,
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
          {
            path: "/dashboard/customer/followed-shops",
            element: <FollowedShop />,
          },
          {
            path: "/dashboard/customer/order-history",
            element: <CustomerOrderHistory />,
          },
        ],
      },
    ],
  },
]);

export default router;
