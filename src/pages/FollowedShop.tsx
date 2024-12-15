/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormSubmitLoading,
  TableDataError,
  TableDataLoading,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import {
  useGetLoggedUserFollowDataQuery,
  useUnfollowShopMutation,
} from "@/redux/features/follower/follower.api";

import { toast } from "sonner";

const FollowedShop = () => {
  let content = null;

  const {
    data: userData,
    isLoading: userDataLoading,
    isError: userDataError,
    refetch: userDataRefetch,
  } = useGetLoggedUserFollowDataQuery(undefined);

  const [unfollowShop, { isLoading: unfollowShopLoading }] =
    useUnfollowShopMutation();

  console.log(userData?.data);

  // ! for unfollowing shop
  const handleUnfollowShop = async (shopId: string) => {
    console.log(shopId);

    try {
      const taostId = toast.loading("Unfollowing Shop....");

      const result = await unfollowShop({ shopId });

      //  *  for any  error
      if (result?.error) {
        const errorMessage = (result?.error as any)?.data?.message;
        console.log(errorMessage);
        toast.error(errorMessage, {
          id: taostId,
          duration: 1400,
        });
      }

      // * for successful insertion
      if (result?.data) {
        userDataRefetch();
        const successMsg = result?.data?.message;
        toast.success(successMsg, {
          id: taostId,
          duration: 1000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while Unfollowing shop  !!!", {
        duration: 1400,
      });
    }
  };

  // *  if data is loading
  if (userDataLoading) {
    content = (
      <tr>
        <td colSpan={8} className="p-4">
          <TableDataLoading />
        </td>
      </tr>
    );
  }

  // *  if any error
  if (!userDataLoading && userDataError) {
    content = (
      <tr>
        <td colSpan={8}>
          <TableDataError message="Something went wrong " />
        </td>
      </tr>
    );
  }

  // * for no data
  if (!userDataLoading && !userDataError && userData?.data?.length < 1) {
    content = (
      <tr>
        <td colSpan={8}>
          <TableDataError message="Nothing Found" />
        </td>
      </tr>
    );
  }

  if (!userDataLoading && !userDataError && userData?.data?.length) {
    content = userData?.data?.map((item: any) => (
      <tr key={item.id} className="border-b">
        <td className="p-4 text-center"> {item?.shop?.name} </td>
        <td className="p-4 text-center">
          <Button
            onClick={() => handleUnfollowShop(item?.shopId)}
            className=" bg-prime50 hover:bg-prime100 "
          >
            Unfollow
          </Button>
        </td>
      </tr>
    ));
  }

  return (
    <>
      {(userDataLoading || unfollowShopLoading) && <FormSubmitLoading />}

      <div className="FollowedShopContainer">
        <div className="FollowedShopWrapper bg-gray-100  shadow rounded-md p-3  ">
          <h3 className="brand text-2xl font-medium mb-6 ">Followed Shop</h3>

          {/*Followed shop table starts  */}
          <div className="manageUserTable relative w-full overflow-auto mt-4 ">
            <table className="w-full text-sm ">
              <thead className="border-b">
                <tr className="w-full text-sm bg-sky-100  ">
                  <th className="px-4 font-medium">Shop Name </th>
                  <th className="px-4 font-medium">Action </th>
                </tr>
              </thead>
              <tbody>{content}</tbody>
            </table>
          </div>
          {/* Followed shop table ends  */}

          {/*  */}
        </div>
      </div>
    </>
  );
};

export default FollowedShop;
