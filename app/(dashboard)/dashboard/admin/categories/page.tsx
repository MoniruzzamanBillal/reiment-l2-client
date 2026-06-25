"use client";

import FormSubmitLoading from "@/components/shared/FormSubmitLoading";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useFetchData, usePatch } from "@/hooks/useApi";
import { TCategory } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export default function ManageCategoryPage() {
  const { data: categoryData, isLoading, isError, refetch } = useFetchData<TCategory[]>(
    ["allCategory"], "/category/all-category"
  );
  const categories: TCategory[] = (categoryData as any)?.data ?? [];

  const { mutateAsync: deleteMutate, isPending: deleteLoading } = usePatch([["allCategory"]]);

  const handleDeleteCategory = async (id: string) => {
    const toastId = toast.loading("Deleting Category...");
    try {
      const result: any = await deleteMutate({ url: `/category/delete-category/${id}`, payload: {} });
      if (result?.data) { refetch(); toast.success(result.data.message, { id: toastId, duration: 1000 }); }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed", { id: toastId, duration: 1400 });
    }
  };

  let content = null;
  if (isLoading) content = <tr><td colSpan={4} className="p-8 text-center text-gray-500">Loading...</td></tr>;
  else if (isError) content = <tr><td colSpan={4} className="p-8 text-center text-red-500">Something went wrong</td></tr>;
  else if (categories.length === 0) content = <tr><td colSpan={4} className="p-8 text-center text-gray-500">Nothing Found</td></tr>;
  else {
    content = categories.map((cat) => (
      <tr key={cat.id} className="border-b hover:bg-gray-50 transition-colors">
        <td className="p-4 text-center">{cat.name}</td>
        <td className="p-4 text-center">
          <div className="flex justify-center">
            <div className="relative size-[4.6rem] rounded-md overflow-hidden">
              <Image src={cat.categoryImg || "/placeholder.svg"} alt={cat.name} fill className="object-cover" sizes="74px" />
            </div>
          </div>
        </td>
        <td className="p-4 text-center">
          <Link href={`/dashboard/admin/categories/update-category/${cat.id}`}>
            <Button className="font-semibold text-sm bg-prime100 hover:bg-prime100 active:scale-95 duration-500">Update</Button>
          </Link>
        </td>
        <td className="p-4 text-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="text-sm">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Category?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone. This will permanently delete the category.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteCategory(cat.id)}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </td>
      </tr>
    ));
  }

  return (
    <>
      {deleteLoading && <FormSubmitLoading />}
      <div className="ManageCategoryContainer">
        <div className="bg-gray-100 border border-gray-300 shadow rounded-md p-3">
          <h3 className="text-2xl font-medium mb-6">Manage Category</h3>
          <div className="mb-6">
            <Link href="/dashboard/admin/categories/add-category">
              <Button className="font-semibold text-sm bg-prime50 hover:bg-prime100 active:scale-95 duration-500">Add new Category</Button>
            </Link>
          </div>
          <div className="relative w-full overflow-auto mt-4">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="w-full text-sm bg-sky-100">
                  <th className="px-4 py-3 font-medium">Category Name</th>
                  <th className="px-4 py-3 font-medium">Category Image</th>
                  <th className="px-4 py-3 font-medium">Update Category</th>
                  <th className="px-4 py-3 font-medium">Delete Category</th>
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
