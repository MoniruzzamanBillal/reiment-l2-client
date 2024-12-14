import DeleteModal from "@/components/shared/DeleteModal";
import UnblockModal from "@/components/shared/UnblockModal";
import {
  FormSubmitLoading,
  TableDataError,
  TableDataLoading,
} from "@/components/ui";
import {
  useBlockVendorMutation,
  useUnblockVendorMutation,
} from "@/redux/features/auth/auth.api";
import { useGetAllShopDataQuery } from "@/redux/features/shop/shop.api";
import { toast } from "sonner";

const alertMessage =
  " This action cannot be undone. This will restrict their operations.";

const unblockAlertMessage = "This action will unblock this vendor .";

const ManageShop = () => {
  const {
    data: shopData,
    isLoading: shopDataLoading,
    isError: shopDataError,
    refetch: shopDataRefetch,
  } = useGetAllShopDataQuery(undefined);

  const [blockVendor, { isLoading: blockShopLoading }] =
    useBlockVendorMutation();
  const [unblockVendor, { isLoading: unblockShopLoading }] =
    useUnblockVendorMutation();

  let content = null;

  // console.log(shopData?.data);

  // ! function for unblocking  shop
  const handleUnblockVendor = async (id: string) => {
    try {
      const taostId = toast.loading("Blocking Vendor....");
      const payload = {
        vendorShopId: id,
      };
      const result = await unblockVendor(payload);

      //  *  for any  error
      if (result?.error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessage = (result?.error as any)?.data?.message;
        console.log(errorMessage);
        toast.error(errorMessage, {
          id: taostId,
          duration: 1400,
        });
      }

      // * for successful insertion
      if (result?.data) {
        shopDataRefetch();
        const successMsg = result?.data?.message;

        toast.success(successMsg, {
          id: taostId,
          duration: 1000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while unblocking vendor !!!", {
        duration: 1400,
      });
    }
  };

  // ! for blacklist vendor
  const handleBlackListShop = async (id: string) => {
    try {
      const taostId = toast.loading("Blocking Vendor....");
      const payload = {
        vendorShopId: id,
      };
      const result = await blockVendor(payload);

      //  *  for any  error
      if (result?.error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessage = (result?.error as any)?.data?.message;
        console.log(errorMessage);
        toast.error(errorMessage, {
          id: taostId,
          duration: 1400,
        });
      }

      // * for successful insertion
      if (result?.data) {
        shopDataRefetch();
        const successMsg = result?.data?.message;

        toast.success(successMsg, {
          id: taostId,
          duration: 1000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while blocking vendor !!!", {
        duration: 1400,
      });
    }
  };

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

        <td
          className={`p-4 text-center font-semibold ${
            shop?.status === "ACTIVE" ? "text-green-600" : "text-red-600"
          }`}
        >
          {shop?.status}
        </td>

        <td className="p-4 text-center">
          {shop?.status === "ACTIVE" ? (
            <DeleteModal
              handleDeleteFunction={handleBlackListShop}
              id={shop?.id}
              alertMessage={alertMessage}
              btnText="Block"
            />
          ) : (
            <UnblockModal
              handleUnblockFunction={handleUnblockVendor}
              id={shop?.id}
              unblockAlertMessage={unblockAlertMessage}
            />
          )}
        </td>
      </tr>
    ));
  }

  return (
    <>
      {(blockShopLoading || unblockShopLoading) && <FormSubmitLoading />}
      <div className="ManageShopContainer">
        <div className="ManageShopWrapper bg-gray-100 border border-gray-300 shadow rounded-md p-3  ">
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
    </>
  );
};

export default ManageShop;
