import { TableDataError, TableDataLoading } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useGetVendorShopQuery } from "@/redux/features/shop/shop.api";
import { Link } from "react-router-dom";

const ManageVendorShop = () => {
  let content = null;

  const {
    data: vendorShopData,
    isLoading: vendorDataLoading,
    error: vendorShopDataError,
  } = useGetVendorShopQuery(undefined);

  // console.log(vendorShopData?.data);

  if (vendorDataLoading) {
    content = (
      <tr>
        <td colSpan={8} className="p-4">
          <TableDataLoading />
        </td>
      </tr>
    );
  }

  if (!vendorDataLoading && vendorShopDataError) {
    content = (
      <tr>
        <td colSpan={8}>
          <TableDataError message="Something went wrong " />
        </td>
      </tr>
    );
  }

  if (!vendorDataLoading && !vendorShopDataError && vendorShopData?.data) {
    content = (
      <tr key={vendorShopData?.data?.id} className="border-b">
        <td className="p-4 text-center">{vendorShopData?.data?.name}</td>

        <td className="p-4 text-center  flex justify-center items-center ">
          <img
            src={vendorShopData?.data?.logo}
            className=" size-[4.4rem] rounded-md "
            alt=""
          />
        </td>

        <td className="p-4 text-center">{vendorShopData?.data?.status}</td>

        <td className="p-4 text-center">
          <Link to={`/`}>
            <Button className=" px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base bg-prime100 hover:bg-prime100 active:scale-95 duration-500 ">
              Update
            </Button>
          </Link>{" "}
        </td>
      </tr>
    );
  }

  return (
    <div className="ManageVendorShopContainer">
      <div className="ManageVendorShopWrapper bg-gray-100 border border-gray-300 shadow rounded-md p-3  ">
        <h3 className="brand text-2xl font-medium mb-8 "> Manage Shop </h3>
        {/* show add new button if there is no vendor shop  */}
        {/* new category add  container starts  */}

        {!vendorShopData?.data && (
          <div className="addNewProduct mb-6 ">
            <Link to={"/dashboard/vendor/add-shop"}>
              <Button className=" px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base bg-prime50 hover:bg-prime100 active:scale-95 duration-500 ">
                Create Shop
              </Button>
            </Link>

            {/*  */}
          </div>
        )}
        {/* new category add  container ends */}

        {/*manage shop table starts  */}
        {vendorShopData?.data && (
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
        )}

        {/* manage shop table ends  */}
        {/*  */}
      </div>
    </div>
  );
};

export default ManageVendorShop;
