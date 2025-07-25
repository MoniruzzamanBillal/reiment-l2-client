import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { RiCloseFill, RiMenu3Fill } from "react-icons/ri";

import { FiShoppingCart } from "react-icons/fi";
import { LuUser } from "react-icons/lu";
import Wrapper from "./Wrapper";

import { useGetUserCartQuery } from "@/redux/features/cart/cart.api";
import { UseGetUser } from "@/utils/SharedFunction";
import { NavSearchInput } from "../ui";
import { Button } from "../ui/button";

const Links = [
  { name: "Home", link: "/" },
  { name: "Products", link: "/products" },
  { name: "Recent Products", link: "/recent-products" },
  { name: "Compare Product", link: "/comparison-product" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const userInfo = UseGetUser();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: cartData } = useGetUserCartQuery(undefined);

  // console.log(userInfo);

  const handleSearchProduct = () => {
    if (!searchTerm) {
      return;
    }

    navigate(`/products?paramSearchTerm=${searchTerm}`);
    setSearchTerm("");
  };

  return (
    <div
      className="  shadow-md w-full fixed top-0 left-0 z-10 "
      style={{
        backdropFilter: "blur(8px)",
      }}
    >
      <Wrapper className="   flex items-center justify-between py-2  m-auto   ">
        {/* logo section */}
        {/* left section  */}
        <div className="imgContainer  ">
          <Link to={"/"}>
            <div className=" text-2xl cursor-pointer flex items-center  gap-x-1">
              <p className="  text-2xl sm:text-2xl md:text-xl lg:text-3xl font-bold font-headingFont ">
                Rei
                <span className=" text-prime100 ">ment </span>
              </p>
            </div>
          </Link>
        </div>

        {/* Menu icon */}
        <div
          onClick={() => setOpen(!open)}
          className="   flex justify-center items-center   cursor-pointer md:hidden  font-semibold  text-2xl "
        >
          {open ? <RiCloseFill className="  " /> : <RiMenu3Fill />}
        </div>

        {/* middle search section  */}
        <div className="middleSection searchSection hidden md:block  md:w-[28%]   ">
          <NavSearchInput
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearchProduct={handleSearchProduct}
          />
        </div>

        {/* rigth section  */}
        {/* linke items */}
        <ul
          className={`absolute bg-white shadow-md 
            md:shadow-none z-[-1] left-0 w-full pl-10 
            md:flex md:items-center pb-8 md:pb-0 
            md:static md:bg-transparent md:z-auto 
            md:w-auto md:pl-0 transition-all 
            duration-300 ease-in 
            text-xs xsm:text-sm sm:text-base 
            md:text-xs xmd:text-sm xlm:text-base 
            ${open ? "top-[3.2rem] block" : "top-[-490px]"}`}
          style={{
            backdropFilter: "blur(3rem)",
          }}
        >
          {Links &&
            Links.map((link, index) => (
              <li
                key={index}
                className="  my-5 xsm:my-7 ml-4 xl:ml-6 md:my-0  font-semibold uppercase"
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

          <div className="buttonSection  md:ml-5 lg:ml-8  flex  items-center gap-x-0.5  ">
            {!userInfo ? (
              <Link to={"/login"}>
                <Button className=" -z-[1] text-xs sm:text-sm md:text-base bg-prime50 hover:bg-prime100 ">
                  Sign in
                </Button>
              </Link>
            ) : (
              <div className="relative">
                <Link
                  to="/dashboard"
                  className="inline-block p-2 rounded-full bg-orange-100 cursor-pointe"
                >
                  <LuUser className=" text-2xl font-bold text-gray-800 " />
                </Link>
              </div>
            )}

            {/* cart button  */}

            <Link to={"/cart"}>
              {userInfo?.userRole == "CUSTOMER" && (
                <div className="cartBtn  pl-0 md:pl-2 mr-3 md:pr-0  cursor-pointer text-2xl  relative ">
                  <FiShoppingCart />

                  {/* cart item number  */}
                  {cartData?.data?.cartItem?.length > 0 && (
                    <div className="number text-gray-100 text-center size-5 bg-prime100 text-xs rounded-full  absolute transform -translate-x-1/2  -translate-y-1/2  top-[0rem] left-[2rem] ">
                      {cartData?.data?.cartItem?.length}
                    </div>
                  )}
                </div>
              )}
            </Link>

            {/* cart button  */}

            {/*  */}
            {/*  */}
            {/*  */}

            {/*  */}
            {/*  */}
          </div>
        </ul>
      </Wrapper>
    </div>
  );
};
export default Navbar;
