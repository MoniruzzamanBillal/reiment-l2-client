import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { RiCloseFill, RiMenu3Fill } from "react-icons/ri";

import Wrapper from "./Wrapper";

import NavbarTop from "../ui/Navbar/NavbarTop";

const Links = [
  { name: "Home", link: "/" },
  { name: "Products", link: "/products" },
  { name: "Recent Products", link: "/recent-products" },
  { name: "Compare Product", link: "/comparison-product" },
];

const Navbar = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
      {/* nav top  */}
      <div className="navbarTopSection bg-orange-300 ">
        <NavbarTop
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearchProduct={handleSearchProduct}
        />
      </div>

      <Wrapper className="   flex items-center justify-between py-2  m-auto   ">
        {/* logo section */}
        {/* left section  */}

        {/* Menu icon */}
        <div
          onClick={() => setOpen(!open)}
          className="   flex justify-center items-center   cursor-pointer md:hidden  font-semibold  text-2xl "
        >
          {open ? <RiCloseFill className="  " /> : <RiMenu3Fill />}
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
        </ul>
      </Wrapper>
    </div>
  );
};
export default Navbar;
