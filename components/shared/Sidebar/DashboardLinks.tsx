"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart2,
  CreditCard,
  History,
  Layers,
  MessageCircle,
  Package,
  Store,
  Tag,
  Users,
} from "lucide-react";
import { CiBookmark } from "react-icons/ci";
import { useAuthStore } from "@/stores/useAuthStore";
import { TDashboardLinks } from "@/types";

const LinkItem = ({ link }: { link: TDashboardLinks }) => {
  const pathname = usePathname();
  const isActive = pathname === link.path || pathname.startsWith(link.path + "/");

  return (
    <Link href={link.path}>
      <div
        className={`flex items-center gap-x-2 my-5 p-1 rounded transition-colors ${
          isActive ? "text-rose-500 font-semibold" : "hover:text-rose-500"
        }`}
      >
        {link.icon}
        <p>{link.name}</p>
      </div>
    </Link>
  );
};

const customerLinks: TDashboardLinks[] = [
  {
    name: "Home",
    path: "/",
    icon: <CiBookmark className="text-xl font-bold" />,
  },
  {
    name: "Followed Shops",
    path: "/dashboard/customer/followed-shops",
    icon: <CiBookmark className="text-xl font-bold" />,
  },
  {
    name: "Order History",
    path: "/dashboard/customer/order-history",
    icon: <CiBookmark className="text-xl font-bold" />,
  },
];

const adminLinks: TDashboardLinks[] = [
  {
    name: "Statistics",
    path: "/dashboard/admin/statistics",
    icon: <BarChart2 className="text-xl font-bold" />,
  },
  {
    name: "Manage Users",
    path: "/dashboard/admin/manage-user",
    icon: <Users className="text-xl font-bold" />,
  },
  {
    name: "Manage Shops",
    path: "/dashboard/admin/manage-shop",
    icon: <Store className="text-xl font-bold" />,
  },
  {
    name: "Categories",
    path: "/dashboard/admin/categories",
    icon: <Layers className="text-xl font-bold" />,
  },
  {
    name: "Coupons",
    path: "/dashboard/admin/manage-coupon",
    icon: <Tag className="text-xl font-bold" />,
  },
  {
    name: "Monitor Transaction",
    path: "/dashboard/admin/monitor-transaction",
    icon: <CreditCard className="text-xl font-bold" />,
  },
  {
    name: "Monitor Review",
    path: "/dashboard/admin/monitor-review",
    icon: <MessageCircle className="text-xl font-bold" />,
  },
];

const vendorLinks: TDashboardLinks[] = [
  {
    name: "Manage Shop",
    path: "/dashboard/vendor/manage-shop",
    icon: <Store className="text-xl font-bold" />,
  },
  {
    name: "Manage Inventory",
    path: "/dashboard/vendor/manage-products",
    icon: <Package className="text-xl font-bold" />,
  },
  {
    name: "Order History",
    path: "/dashboard/vendor/order-history",
    icon: <History className="text-xl font-bold" />,
  },
  {
    name: "Customer Reviews",
    path: "/dashboard/vendor/monitor-reviews",
    icon: <MessageCircle className="text-xl font-bold" />,
  },
];

const DashboardLinks = () => {
  const user = useAuthStore((s) => s.user);
  const userRole = user?.userRole;

  let links = customerLinks;
  if (userRole === "ADMIN") links = adminLinks;
  if (userRole === "VENDOR") links = vendorLinks;

  return (
    <div>
      {links.map((item) => (
        <LinkItem key={item.name} link={item} />
      ))}
    </div>
  );
};

export default DashboardLinks;
