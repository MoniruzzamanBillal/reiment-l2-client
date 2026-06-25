"use client";

import FormSubmitLoading from "@/components/shared/FormSubmitLoading";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useFetchData, usePatch } from "@/hooks/useApi";
import { TAdminShop } from "@/types";
import Image from "next/image";
import { toast } from "sonner";

export default function AdminManageShopPage() {
  const { data: shopData, isLoading, isError, refetch } = useFetchData<TAdminShop[]>(
    ["allShopData"], "/shop/all-shop-data"
  );
  const shops: TAdminShop[] = (shopData as any)?.data ?? [];

  const { mutateAsync: blockMutate, isPending: blockPending } = usePatch([["allShopData"]]);
  const { mutateAsync: unblockMutate, isPending: unblockPending } = usePatch([["allShopData"]]);

  const handleBlockShop = async (vendorShopId: string) => {
    const toastId = toast.loading("Blocking Vendor...");
    try {
      const result: any = await blockMutate({ url: "/auth/block-vendor-shop", payload: { vendorShopId } });
      if (result?.data) { refetch(); toast.success(result.data.message, { id: toastId, duration: 1000 }); }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed", { id: toastId, duration: 1400 });
    }
  };

  const handleUnblockShop = async (vendorShopId: string) => {
    const toastId = toast.loading("Unblocking Vendor...");
    try {
      const result: any = await unblockMutate({ url: "/auth/unblock-vendor-shop", payload: { vendorShopId } });
      if (result?.data) { refetch(); toast.success(result.data.message, { id: toastId, duration: 1000 }); }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed", { id: toastId, duration: 1400 });
    }
  };

  let content = null;
  if (isLoading) content = <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading...</td></tr>;
  else if (isError) content = <tr><td colSpan={5} className="p-8 text-center text-red-500">Something went wrong</td></tr>;
  else if (shops.length === 0) content = <tr><td colSpan={5} className="p-8 text-center text-gray-500">Nothing Found</td></tr>;
  else {
    content = shops.map((shop) => (
      <tr key={shop.id} className="border-b hover:bg-gray-50 transition-colors">
        <td className="p-4 text-center">{shop.name}</td>
        <td className="p-4 text-center">
          <div className="flex justify-center">
            <div className="relative size-[4.4rem] rounded-md overflow-hidden">
              <Image src={shop.logo || "/placeholder.svg"} alt={shop.name} fill className="object-cover" sizes="70px" />
            </div>
          </div>
        </td>
        <td className="p-4 text-center">{shop.vendor?.username}</td>
        <td className={`p-4 text-center font-semibold ${shop.status === "ACTIVE" ? "text-green-600" : "text-red-600"}`}>{shop.status}</td>
        <td className="p-4 text-center">
          {shop.status === "ACTIVE" ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="text-sm">Block</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Block Vendor Shop?</AlertDialogTitle>
                  <AlertDialogDescription>This action cannot be undone. This will restrict their operations.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleBlockShop(shop.id)}>Block</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="text-sm bg-green-600 hover:bg-green-700">Unblock</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Unblock Vendor?</AlertDialogTitle>
                  <AlertDialogDescription>This action will unblock this vendor.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleUnblockShop(shop.id)}>Unblock</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </td>
      </tr>
    ));
  }

  return (
    <>
      {(blockPending || unblockPending) && <FormSubmitLoading />}
      <div className="ManageShopContainer">
        <div className="bg-gray-100 border border-gray-300 shadow rounded-md p-3">
          <h3 className="text-2xl font-medium mb-4">Manage Shop</h3>
          <div className="relative w-full overflow-auto mt-4">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="w-full text-sm bg-sky-100">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Logo</th>
                  <th className="px-4 py-3 font-medium">Vendor</th>
                  <th className="px-4 py-3 font-medium">Status</th>
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
