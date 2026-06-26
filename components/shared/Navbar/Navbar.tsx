"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Wrapper from "@/components/shared/ui/Wrapper";
import NavbarTop from "./NavbarTop";
import NavbarBottom from "./NavbarBottom";

const Navbar = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchProduct = () => {
    if (!searchTerm) return;
    router.push(`/products?paramSearchTerm=${searchTerm}`);
    setSearchTerm("");
  };

  return (
    <div
      className="shadow-md w-full fixed top-0 left-0 z-10 bg-white/80"
      style={{ backdropFilter: "blur(8px)" }}
    >
      <Wrapper>
        <NavbarTop
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearchProduct={handleSearchProduct}
        />
        <NavbarBottom />
      </Wrapper>
    </div>
  );
};

export default Navbar;
