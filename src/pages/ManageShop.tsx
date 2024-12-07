import { TableDataError, TableDataLoading } from "@/components/ui";
import { useGetAllShopDataQuery } from "@/redux/features/shop/shop.api";

const ManageShop = () => {
  const {
    data: shopData,
    isLoading: shopDataLoading,
    isError: shopDataError,
    refetch: shopDataRefetch,
  } = useGetAllShopDataQuery(undefined);

  let content = null;

  console.log(shopData?.data);

  // *  if data is loading
  if (shopDataLoading) {
    content = (
      <tr>
        <td colSpan={8} className="p-4">
          <TableDataLoading />
        </td>
      </tr>
    );
  }

  // *  if any error
  if (!shopDataLoading && shopDataError) {
    content = (
      <tr>
        <td colSpan={8}>
          <TableDataError message="Something went wrong " />
        </td>
      </tr>
    );
  }

  // * for no data
  if (!shopDataLoading && !shopDataLoading && shopData?.data?.length < 1) {
    content = (
      <tr>
        <td colSpan={8}>
          <TableDataError message="Nothing Found" />
        </td>
      </tr>
    );
  }

  // * for user data
  if (!shopDataLoading && !shopDataLoading && shopData?.data?.length) {
    content = shopData?.data?.map((shop: any) => (
      <tr key={shop.id} className="border-b">
        <td className="p-4 text-center">{shop?.name}</td>
        <td className="p-4 text-center  flex justify-center items-center ">
          <img src={shop?.logo} className=" size-[4.4rem] rounded-md " alt="" />
        </td>
        <td className="p-4 text-center">{shop?.vendor?.username}</td>

        <td className="p-4 text-center">{shop?.status}</td>
        <td className="p-4 text-center"> delete user </td>
      </tr>
    ));
  }

  return (
    <div className="ManageShopContainer">
      <div className="ManageShopWrapper bg-gray-100  shadow rounded-md p-3  ">
        <h3 className="brand text-2xl font-medium mb-4 "> Manage Shop </h3>

        {/*manage shop table starts  */}
        <div className="manageUserTable relative w-full overflow-auto mt-4 ">
          <table className="w-full text-sm ">
            <thead className="border-b">
              <tr className="w-full text-sm bg-sky-100  ">
                <th className="px-4 font-medium">Name</th>
                <th className="px-4 font-medium">Logo </th>
                <th className="px-4 font-medium">Vendor </th>
                <th className="px-4 font-medium">Status </th>
                <th className="px-4 font-medium">Action </th>
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

export default ManageShop;
