import { TDashboardLinks } from "@/types/globalTypes";
import { UserRoleConst } from "@/utils/Constants";
import { GetUserRole } from "@/utils/GetUserRole";
import {
  BarChart2,
  CreditCard,
  Layers,
  MessageCircle,
  Store,
  Tag,
  Users,
} from "lucide-react";
import { CiBookmark } from "react-icons/ci";
import { NavLink } from "react-router-dom";

const LinkItem = ({ link }: { link: TDashboardLinks }) => {
  return (
    <NavLink to={link.path}>
      <div className="linksContainer   flex items-center gap-x-1  my-6 ">
        {link.icon}
        <p>{link.name}</p>
      </div>
    </NavLink>
  );
};

const DashboardLinks = () => {
  const userRole = GetUserRole();

  let links = [
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

  // ! admin role links
  if (userRole === UserRoleConst.ADMIN) {
    links = [
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
  }

  // ! vendor links
  if (userRole === UserRoleConst.VENDOR) {
    links = [
      {
        name: "Manage Shop",
        path: "/dashboard/vendor/manage-shop",
        icon: <CiBookmark className=" text-xl font-bold " />,
      },
      {
        name: "Manage Inventory",
        path: "/dashboard/vendor/manage-products",
        icon: <CiBookmark className=" text-xl font-bold " />,
      },
      {
        name: "Order History",
        path: "/dashboard/vendor/order-history",
        icon: <CiBookmark className=" text-xl font-bold " />,
      },
      {
        name: "Customer Reviews",
        path: "/dashboard/vendor/monitor-reviews",
        icon: <CiBookmark className=" text-xl font-bold " />,
      },
    ];
  }

  return (
    <div>
      {links && links?.map((item) => <LinkItem key={item?.name} link={item} />)}
    </div>
  );
};

export default DashboardLinks;
