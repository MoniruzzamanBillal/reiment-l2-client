import { useState } from "react";
import { RiCloseFill, RiMenu3Fill } from "react-icons/ri";
import { Link } from "react-router-dom";

const Links = [
  { name: "Home", link: "/" },
  { name: "Products", link: "/products" },
  { name: "Recent Products", link: "/recent-products" },
  { name: "Compare Product", link: "/comparison-product" },
];

const NavbatBottom = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="NavbatBottomContainer flex justify-between py-2 ">
      {/* left category section  */}

      <div className="leftCategorySection bg-violet-400 ">
        <h1>left category section </h1>
      </div>

      {/* right menu section  */}
      <div className="rightMenuSection bg-teal-300 ">
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
      </div>
    </div>
  );
};

export default NavbatBottom;
