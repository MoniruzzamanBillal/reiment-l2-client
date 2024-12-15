import App from "@/App";
import {
  AddCategory,
  AddCoupon,
  AddProduct,
  AddShop,
  AdminStatistics,
  AllProducts,
  ChangePassword,
  Checkout,
  ComparisonTable,
  CustomerOrderHistory,
  Dashboard,
  DashboardLayout,
  EmailResetConfirmation,
  FlashSale,
  FollowedShop,
  ForgotPassword,
  HomePage,
  Login,
  ManageCategory,
  ManageCoupon,
  ManageShop,
  ManageUsers,
  ManageVendorProduct,
  ManageVendorShop,
  MonitorReview,
  MonitorTransaction,
  OrderSuccess,
  ProductDetail,
  RecentProducts,
  Register,
  ShopDetail,
  UpdateCategory,
  UpdateProduct,
  UpdateProfile,
  UpdateShop,
  UserCart,
  VendorCustomerReview,
  VendorOderHistory,
} from "@/pages";
import ResetPassword from "@/pages/ResetPassword";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/change-password",
        element: <ChangePassword />,
      },
      {
        path: "/reset-password/:token",
        element: <ResetPassword />,
      },
      {
        path: "/email-reset-confirmation/:email",
        element: <EmailResetConfirmation />,
      },
      {
        path: "/sign-up",
        element: <Register />,
      },
      {
        path: "/forgotPassword",
        element: <ForgotPassword />,
      },
      {
        path: "/products",
        element: <AllProducts />,
      },
      // {
      //   path: "/products/:ParamCategory",
      //   element: <AllProducts />,
      // },
      // {
      //   path: "/products/:paramSearchTerm",
      //   element: <AllProducts />,
      // },
      {
        path: "/flash-sale",
        element: <FlashSale />,
      },
      {
        path: "/product/detail/:id",
        element: <ProductDetail />,
      },
      {
        path: "/shop/detail/:id",
        element: <ShopDetail />,
      },
      {
        path: "/cart",
        element: <UserCart />,
      },
      {
        path: "/recent-products",
        element: <RecentProducts />,
      },
      {
        path: "/comparison-product",
        element: <ComparisonTable />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "/order-success",
        element: <OrderSuccess />,
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
            path: "/dashboard/update-profile/:id",
            element: <UpdateProfile />,
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
            path: "/dashboard/admin/manage-coupon",
            element: <ManageCoupon />,
          },
          {
            path: "/dashboard/admin/manage-coupon/add-coupon",
            element: <AddCoupon />,
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
            path: "/dashboard/vendor/update-shop/:id",
            element: <UpdateShop />,
          },
          {
            path: "/dashboard/vendor/manage-products",
            element: <ManageVendorProduct />,
          },
          {
            path: "/dashboard/vendor/add-products",
            element: <AddProduct />,
          },
          {
            path: "/dashboard/vendor/update-products/:id",
            element: <UpdateProduct />,
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
