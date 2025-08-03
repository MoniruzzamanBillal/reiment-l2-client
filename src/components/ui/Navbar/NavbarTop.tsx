import { useGetUserCartQuery } from "@/redux/features/cart/cart.api";
import { UseGetUser } from "@/utils/SharedFunction";
import { GitCompareArrows } from "lucide-react";
import { FiShoppingCart } from "react-icons/fi";
import { LuUser } from "react-icons/lu";
import { Link } from "react-router-dom";
import { Button } from "../button";
import NavSearchInput from "../NavSearchInput";

type NavSearchInputProps = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  handleSearchProduct: () => void;
};

const NavbarTop = ({
  searchTerm,
  setSearchTerm,
  handleSearchProduct,
}: NavSearchInputProps) => {
  const userInfo = UseGetUser();

  const { data: cartData } = useGetUserCartQuery(undefined);

  return (
    <div className="NavbarTopContainer flex justify-between  ">
      {/* nav left section  */}
      <div className="navLeft bg-red-500 flex justify-between ">
        {/* logo section  */}
        <div className="logoContainer bg-pink-300  ">
          <Link to={"/"}>
            <div className=" text-2xl cursor-pointer flex items-center  gap-x-1">
              <p className="  text-2xl sm:text-2xl md:text-xl lg:text-3xl font-bold font-headingFont ">
                Rei
                <span className=" text-prime100 ">ment </span>
              </p>
            </div>
          </Link>
        </div>

        {/* search section  */}
        <div className="searchSection bg-blue-400">
          <NavSearchInput
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearchProduct={handleSearchProduct}
          />
        </div>
      </div>

      {/* right section  */}
      {/* nav right , icon section  */}
      <div className="iconSection bg-green-300 flex justify-between items-center gap-x-0.5   ">
        {/* cart button  */}

        <Link to={"/comparison-product"}>
          <GitCompareArrows />
        </Link>

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
      </div>
    </div>
  );
};

export default NavbarTop;
