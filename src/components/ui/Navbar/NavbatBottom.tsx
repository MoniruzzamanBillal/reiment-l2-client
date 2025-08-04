import { useGetAllCategoryQuery } from "@/redux/features/category/category.api";
import { useEffect, useState } from "react";
import { RiCloseFill, RiMenu3Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../navigation-menu";

type TCategoryOption = {
  name: string;
  value: string;
};

type TCategory = {
  id: string;
  name: string;
};

const Links = [
  { name: "Home", link: "/" },
  { name: "Products", link: "/products" },
  { name: "Flash Sale", link: "/flash-sale" },
  { name: "Recent Products", link: "/recent-products" },
  { name: "Compare Product", link: "/comparison-product" },
  { name: "Contact", link: "/contact" },
];

const NavbatBottom = () => {
  const [open, setOpen] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<TCategoryOption[]>([]);

  const { data: categoryData, isLoading: categoryDataLoading } =
    useGetAllCategoryQuery(undefined);

  // console.log(categoryData?.data )

  //   ! effect for get category data
  useEffect(() => {
    if (categoryData?.data) {
      const modifiedData = categoryData?.data?.map((item: TCategory) => {
        const optionValue = {
          name: item?.name,
          value: item?.id,
        };

        return optionValue;
      });

      const initialData: TCategoryOption = {
        name: "All",
        value: "",
      };

      setCategoryOptions([initialData, ...modifiedData]);
    }
  }, [categoryData?.data, categoryDataLoading]);

  // console.log(categoryOptions);

  return (
    <div className="NavbatBottomContainer flex justify-between items-center py-2 ">
      {/* left category section  */}

      <div className="leftCategorySection  ">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className=" border border-prime100  ">
                All Categories
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="text-sm font-medium text-gray-800 w-[11rem] xsm:w-[16rem] ">
                  {categoryOptions &&
                    categoryOptions?.map(
                      (item: { name: string; value: string }, ind: number) => (
                        <li
                          key={ind}
                          className="w-full border-b border-gray-300"
                        >
                          <Link to={`/products?ParamCategory=${item?.value}`}>
                            <p className="  ml-6 py-2  ">{item?.name}</p>
                          </Link>
                        </li>
                      )
                    )}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* right menu section  */}
      <div className="rightMenuSection  ">
        {/* Menu icon */}
        <div
          onClick={() => setOpen(!open)}
          className="   flex justify-center items-center   cursor-pointer md:hidden  font-semibold  text-2xl "
        >
          {open ? <RiCloseFill /> : <RiMenu3Fill />}
        </div>

        {/* rigth section  */}
        {/* linke items */}
        <ul
          className={`absolute bg-gray-100 shadow-md 
            md:shadow-none z-[-1] left-0 w-full pr-5 
            md:flex text-end md:items-center pb-8 md:pb-0 
            md:static md:bg-transparent md:z-auto 
            md:w-auto md:pl-0 transition-all 
            duration-300 ease-in 
            text-xs xsm:text-sm sm:text-base 
            md:text-xs xmd:text-sm xlm:text-base 
            ${open ? "top-[6.8rem] block" : "top-[-490px]"}`}
          style={{
            backdropFilter: "blur(3rem)",
          }}
        >
          {Links &&
            Links.map((link, index) => (
              <li
                key={index}
                className="   my-5 xsm:my-7 ml-4 xl:ml-6 md:my-0  font-semibold uppercase"
              >
                <Link
                  to={link.link}
                  className=" hover:text-prime50 duration-500  "
                  onClick={() => setOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default NavbatBottom;
