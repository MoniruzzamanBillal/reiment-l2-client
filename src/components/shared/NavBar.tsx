import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Wrapper from "./Wrapper";

import NavbarTop from "../ui/Navbar/NavbarTop";
import NavbatBottom from "../ui/Navbar/NavbatBottom";

const Navbar = () => {
  const navigate = useNavigate();

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
      className="   shadow-md w-full fixed top-0 left-0 z-10 "
      style={{
        backdropFilter: "blur(8px)",
      }}
    >
      <Wrapper className="      ">
        {/* nav top  */}

        <NavbarTop
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearchProduct={handleSearchProduct}
        />

        <NavbatBottom />
      </Wrapper>
    </div>
  );
};
export default Navbar;
