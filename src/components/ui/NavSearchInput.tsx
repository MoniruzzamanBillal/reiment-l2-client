import { FaSearch } from "react-icons/fa";
import { Button } from "./button";
import { Input } from "./input";

type NavSearchInputProps = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  handleSearchProduct: () => void;
};

const NavSearchInput = ({
  searchTerm,
  setSearchTerm,
  handleSearchProduct,
}: NavSearchInputProps) => {
  return (
    <div className="searchSection border border-prime50/40 rounded-md flex items-center ">
      <Input
        type="text"
        placeholder="Looking for...."
        className=" rounded-none text-xs  "
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button
        onClick={() => handleSearchProduct()}
        className=" rounded-none text-xs bg-prime100 hover:bg-prime100  "
      >
        <FaSearch />
      </Button>
    </div>
  );
};

export default NavSearchInput;
