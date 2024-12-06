import { GetUserRole } from "@/utils/GetUserRole";
import { CiBookmark } from "react-icons/ci";
import { UserRoleConst } from "@/utils/Constants";
import { TDashboardLinks } from "@/types/globalTypes";
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
      name: "Order History",
      path: "/dashboard/customer/order-history",
      icon: <CiBookmark className="text-xl font-bold" />,
    },
    {
      name: "Cart",
      path: "/dashboard/customer/cart",
      icon: <CiBookmark className="text-xl font-bold" />,
    },
    {
      name: "Followed Shops",
      path: "/dashboard/customer/followed-shops",
      icon: <CiBookmark className="text-xl font-bold" />,
    },

    {
      name: "Compare Products",
      path: "/dashboard/customer/compare-products",
      icon: <CiBookmark className="text-xl font-bold" />,
    },
  ];

  // ! admin role links
  if (userRole === UserRoleConst.ADMIN) {
    links = [
      {
        name: "Statistics",
        path: "/dashboard/admin/statistics",
        icon: <CiBookmark className=" text-xl font-bold " />,
      },
      {
        name: "Manage Users",
        path: "/dashboard/admin/manege-user",
        icon: <CiBookmark className=" text-xl font-bold " />,
      },
      {
        name: "Manage Shops",
        path: "/dashboard/admin/manage-shops",
        icon: <CiBookmark className=" text-xl font-bold " />,
      },
      {
        name: "Product Categories",
        path: "/dashboard/admin/categories",
        icon: <CiBookmark className=" text-xl font-bold " />,
      },
      {
        name: "Transaction Monitoring",
        path: "/dashboard/admin/transactions",
        icon: <CiBookmark className=" text-xl font-bold " />,
      },
    ];
  }

  // ! vendor links
  if (userRole === UserRoleConst.VENDOR) {
    links = [
      {
        name: "Manage Shop",
        path: "/dashboard/vendor/shop",
        icon: <CiBookmark className=" text-xl font-bold " />,
      },
      {
        name: "Products",
        path: "/dashboard/vendor/products",
        icon: <CiBookmark className=" text-xl font-bold " />,
      },
      {
        name: "Orders",
        path: "/dashboard/vendor/orders",
        icon: <CiBookmark className=" text-xl font-bold " />,
      },
      {
        name: "Reviews",
        path: "/dashboard/vendor/reviews",
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
