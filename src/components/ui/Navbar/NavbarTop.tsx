import { useGetUserCartQuery } from "@/redux/features/cart/cart.api";
import { useAppSelector } from "@/redux/hook";
import { UseGetUser } from "@/utils/SharedFunction";
import { FiShoppingCart } from "react-icons/fi";
import { IoMdGitCompare } from "react-icons/io";
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

  const comparisonProducts = useAppSelector(
    (state) => state?.comparison?.products
  );

  //   console.log(comparisonProducts?.length);

  return (
    <div className="NavbarTopContainer flex justify-between  py-1 ">
      {/* nav left section  */}
      <div className="navLeft flex justify-between items-center w-[70%] md:w-[60%] lg:w-[45%] ">
        {/* logo section  */}
        <div className="logoContainer   ">
          <Link to={"/"}>
            <p className="  text-2xl sm:text-3xl font-bold font-headingFont ">
              Rei
              <span className=" text-prime100 ">ment </span>
            </p>
          </Link>
        </div>

        {/* search section  */}
        <div className="searchSection hidden sm:block sm:w-[70%]   ">
          <NavSearchInput
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearchProduct={handleSearchProduct}
          />
        </div>
      </div>

      {/* right section  */}
      {/* nav right , icon section  */}
      <div className="iconSection  flex justify-between items-center gap-x-8 sm:gap-x-6 md:gap-x-5   ">
        {/* cart button  */}

        <Link to={"/comparison-product"} className="  relative ">
          <IoMdGitCompare className=" text-xl " />

          {comparisonProducts?.length > 0 && (
            <div className="number text-gray-100 text-center size-5 bg-prime100 text-xs rounded-full  absolute transform -translate-x-1/2  -translate-y-1/2  top-[0rem] left-[1.6rem] ">
              {comparisonProducts?.length}
            </div>
          )}
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
