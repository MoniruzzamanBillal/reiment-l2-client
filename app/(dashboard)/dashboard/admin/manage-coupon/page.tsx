"use client";

import FormSubmitLoading from "@/components/shared/FormSubmitLoading";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useFetchData, useDeleteData } from "@/hooks/useApi";
import { TCoupon } from "@/types";
import Link from "next/link";
import { toast } from "sonner";

export default function ManageCouponPage() {
  const { data: couponData, isLoading, isError, refetch } = useFetchData<TCoupon[]>(
    ["allCoupon"], "/coupon/all-coupon"
  );
  const coupons: TCoupon[] = (couponData as any)?.data ?? [];

  const { mutateAsync: deleteMutate, isPending: deleteLoading } = useDeleteData([["allCoupon"]]);

  const handleDeleteCoupon = async (id: string) => {
    const toastId = toast.loading("Deleting Coupon...");
    try {
      const result: any = await deleteMutate({ url: `/coupon/delete-coupon/${id}` });
      if (result?.success) { refetch(); toast.success(result.message, { id: toastId, duration: 1000 }); }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed", { id: toastId, duration: 1400 });
    }
  };

  let content = null;
  if (isLoading) content = <tr><td colSpan={7} className="p-8 text-center text-gray-500">Loading...</td></tr>;
  else if (isError) content = <tr><td colSpan={7} className="p-8 text-center text-red-500">Something went wrong</td></tr>;
  else if (coupons.length === 0) content = <tr><td colSpan={7} className="p-8 text-center text-gray-500">Nothing Found</td></tr>;
  else {
    content = coupons.map((coupon) => (
      <tr key={coupon.id} className="border-b hover:bg-gray-50 transition-colors">
        <td className="p-4 text-center">{coupon.code}</td>
        <td className="p-4 text-center">${coupon.discountValue}</td>
        <td className="p-4 text-center">{coupon.usageLimit}</td>
        <td className="p-4 text-center">{coupon.usedCount} / {coupon.usageLimit}</td>
        <td className="p-4 text-center">{new Date(coupon.startDate).toLocaleDateString()}</td>
        <td className="p-4 text-center">{new Date(coupon.endDate).toLocaleDateString()}</td>
        <td className="p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Link href={`/dashboard/admin/manage-coupon/update-coupon/${coupon.id}`}>
              <Button variant="outline" className="text-sm">Update</Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="text-sm">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Coupon?</AlertDialogTitle>
                  <AlertDialogDescription>This action cannot be undone. This will permanently delete the coupon.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleteCoupon(coupon.id)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </td>
      </tr>
    ));
  }

  return (
    <>
      {deleteLoading && <FormSubmitLoading />}
      <div className="ManageCouponContainer">
        <div className="bg-gray-100 border border-gray-300 shadow rounded-md p-3">
          <h3 className="text-2xl font-medium mb-6">Manage Coupon</h3>
          <div className="mb-6">
            <Link href="/dashboard/admin/manage-coupon/add-coupon">
              <Button className="font-semibold text-sm bg-prime50 hover:bg-prime100 active:scale-95 duration-500">Add new Coupon</Button>
            </Link>
          </div>
          <div className="relative w-full overflow-auto mt-4">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="w-full text-sm bg-sky-100">
                  <th className="px-4 py-3 font-medium">Coupon Code</th>
                  <th className="px-4 py-3 font-medium">Discount Amount</th>
                  <th className="px-4 py-3 font-medium">Usage Limit</th>
                  <th className="px-4 py-3 font-medium">Used / Limit</th>
                  <th className="px-4 py-3 font-medium">Start Date</th>
                  <th className="px-4 py-3 font-medium">End Date</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
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
