import App from "@/App";
import {
  AdminStatistics,
  Dashboard,
  DashboardLayout,
  Login,
  ManageCategory,
  ManageShop,
  ManageUsers,
  MonitorReview,
  MonitorTransaction,
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
            path: "/dashboard/admin/transactions",
            element: <MonitorTransaction />,
          },
          {
            path: "/dashboard/admin/review",
            element: <MonitorReview />,
          },
        ],
      },
    ],
  },
]);

export default router;
