"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RiCloseFill, RiMenu3Fill } from "react-icons/ri";
import { useFetchData } from "@/hooks/useApi";
import { TCategory } from "@/types";

type TCategoryOption = {
  name: string;
  value: string;
};

const Links = [
  { name: "Home", link: "/" },
  { name: "Products", link: "/products" },
  { name: "Flash Sale", link: "/flash-sale" },
  { name: "Recent Products", link: "/recent-products" },
  { name: "Compare Product", link: "/comparison-product" },
  { name: "Shop", link: "/shops" },
  { name: "Contact", link: "/contact" },
];

const NavbarBottom = () => {
  const [open, setOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<TCategoryOption[]>([]);

  const { data: categoryData } = useFetchData<TCategory[]>(
    ["allCategory"],
    "/category/all-category",
  );

  useEffect(() => {
    if (categoryData?.data) {
      const modifiedData = (categoryData.data as unknown as TCategory[]).map(
        (item) => ({ name: item.name, value: item.id }),
      );
      setCategoryOptions([{ name: "All", value: "" }, ...modifiedData]);
    }
  }, [categoryData]);

  return (
    <div className="flex justify-between items-center py-2 relative">
      {/* category dropdown */}
      <div className="relative">
        <button
          onClick={() => setCategoryOpen(!categoryOpen)}
          className="border border-indigo-600 rounded-full px-4 py-1.5 text-sm font-medium flex items-center gap-1 hover:bg-indigo-50 transition-colors text-indigo-700"
        >
          All Categories
          <span className="text-xs">{categoryOpen ? "▲" : "▼"}</span>
        </button>
        {categoryOpen && (
          <div className="absolute top-full left-0 z-50 bg-white border border-gray-200 shadow-lg rounded-md w-[14rem] max-h-72 overflow-y-auto">
            <ul className="text-sm font-medium text-gray-800">
              {categoryOptions.map((item, ind) => (
                <li key={ind} className="border-b border-gray-100">
                  <Link
                    href={`/products?ParamCategory=${item.value}`}
                    className="block px-4 py-2 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                    onClick={() => setCategoryOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* mobile menu icon */}
      <div
        onClick={() => setOpen(!open)}
        className="flex justify-center items-center cursor-pointer xmd:hidden font-semibold text-2xl"
      >
        {open ? <RiCloseFill /> : <RiMenu3Fill />}
      </div>

      {/* nav links */}
      <ul
        className={`absolute bg-white shadow-sm
          xmd:shadow-none z-40 left-0 w-full pr-5 sm:pr-8
          xmd:flex text-end md:items-center pb-2 xmd:pb-0
          xmd:static xmd:bg-transparent xmd:z-auto
          xmd:w-auto xmd:pl-0 transition-all
          duration-300 ease-in
          text-xs xsm:text-sm sm:text-base
          xmd:text-sm xlm:text-base
          ${open ? "top-[4rem] block" : "top-[-490px]"}`}
        style={{ backdropFilter: "blur(1rem)" }}
      >
        {Links.map((link, index) => (
          <li
            key={index}
            className="my-4 ml-3 xl:ml-6 font-medium tracking-wide"
          >
            <Link
              href={link.link}
              className="hover:text-indigo-600 duration-300"
              onClick={() => setOpen(false)}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavbarBottom;
