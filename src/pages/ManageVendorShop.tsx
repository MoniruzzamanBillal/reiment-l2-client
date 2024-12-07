import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ManageVendorShop = () => {
  const content = null;

  return (
    <div className="ManageVendorShopContainer">
      <div className="ManageVendorShopWrapper bg-gray-100  shadow rounded-md p-3  ">
        <h3 className="brand text-2xl font-medium mb-4 "> Manage Shop </h3>

        {/* new category add  container starts  */}
        <div className="addNewProduct mb-6 ">
          <Link to={"/"}>
            <Button className=" px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base bg-prime50 hover:bg-prime100 active:scale-95 duration-500 ">
              Create Shop
            </Button>
          </Link>

          {/*  */}
        </div>
        {/* new category add  container ends */}

        {/*manage shop table starts  */}
        <div className="manageUserTable relative w-full overflow-auto mt-4 ">
          <table className="w-full text-sm ">
            <thead className="border-b">
              <tr className="w-full text-sm bg-sky-100  ">
                <th className="px-4 font-medium">Name</th>
                <th className="px-4 font-medium">Logo </th>
                <th className="px-4 font-medium">Status </th>
                <th className="px-4 font-medium">Update </th>
              </tr>
            </thead>
            <tbody>{content}</tbody>
          </table>
        </div>
        {/* manage shop table ends  */}

        {/*  */}
      </div>
    </div>
  );
};

export default ManageVendorShop;
