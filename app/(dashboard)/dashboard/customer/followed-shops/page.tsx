"use client";

import FormSubmitLoading from "@/components/shared/FormSubmitLoading";
import { Button } from "@/components/ui/button";
import { useDeleteData, useFetchData } from "@/hooks/useApi";
import { TFollowData } from "@/types";
import { toast } from "sonner";

export default function FollowedShopsPage() {
  const {
    data: followData,
    isLoading,
    isError,
    refetch,
  } = useFetchData<TFollowData[]>(["loggedUserFollow"], "/follow/logged-user-data");

  const { mutateAsync: unfollowMutate, isPending: unfollowPending } =
    useDeleteData([["loggedUserFollow"]]);

  const shops: TFollowData[] = (followData as any)?.data ?? [];

  const handleUnfollowShop = async (shopId: string) => {
    const toastId = toast.loading("Unfollowing Shop...");
    try {
      const result: any = await unfollowMutate({
        url: "/follow/unfollow-shop",
        payload: { shopId },
      });
      if (result?.data) {
        refetch();
        toast.success(result.data.message, { id: toastId, duration: 1000 });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong", {
        id: toastId,
        duration: 1400,
      });
    }
  };

  let content = null;

  if (isLoading) {
    content = (
      <tr>
        <td colSpan={2} className="p-8 text-center text-gray-500">
          Loading...
        </td>
      </tr>
    );
  } else if (isError) {
    content = (
      <tr>
        <td colSpan={2} className="p-8 text-center text-red-500">
          Something went wrong
        </td>
      </tr>
    );
  } else if (shops.length === 0) {
    content = (
      <tr>
        <td colSpan={2} className="p-8 text-center text-gray-500">
          Nothing Found
        </td>
      </tr>
    );
  } else {
    content = shops.map((item) => (
      <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
        <td className="p-4 text-center">{item?.shop?.name}</td>
        <td className="p-4 text-center">
          <Button
            onClick={() => handleUnfollowShop(item?.shopId)}
            disabled={unfollowPending}
            className="bg-prime50 hover:bg-prime100"
          >
            Unfollow
          </Button>
        </td>
      </tr>
    ));
  }

  return (
    <>
      {(isLoading || unfollowPending) && <FormSubmitLoading />}

      <div className="FollowedShopContainer">
        <div className="FollowedShopWrapper bg-gray-100 shadow rounded-md p-3">
          <h3 className="text-2xl font-medium mb-6">Followed Shop</h3>

          <div className="relative w-full overflow-auto mt-4">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="w-full text-sm bg-sky-100">
                  <th className="px-4 py-3 font-medium">Shop Name</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>{content}</tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
