"use client";

import FormSubmitLoading from "@/components/shared/FormSubmitLoading";
import { Button } from "@/components/ui/button";
import { useFetchData, usePost, usePatch } from "@/hooks/useApi";
import { useOrderPusher } from "@/hooks/useOrderPusher";
import { TVendorProduct, TVendorShop } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ManageVendorProductPage() {
  useOrderPusher();

  const router = useRouter();

  const { data: shopData } = useFetchData<TVendorShop>(["vendorShop"], "/shop/vendor-shop");
  const shop: TVendorShop | null = (shopData as any)?.data ?? null;
  const shopId = shop?.id;

  const {
    data: productData,
    isLoading,
    isError,
    refetch,
  } = useFetchData<TVendorProduct[]>(
    ["vendorProducts", shopId ?? ""],
    `/product/get-vendor-product/${shopId}`,
    { enabled: !!shopId }
  );
  const products: TVendorProduct[] = (productData as any)?.data ?? [];

  const { mutateAsync: deleteMutate, isPending: deleteLoading } = usePatch([["vendorProducts", shopId ?? ""]]);
  const { mutateAsync: duplicateMutate, isPending: duplicateLoading } = usePost([["vendorProducts", shopId ?? ""]]);

  const handleDeleteProduct = async (prodId: string) => {
    const toastId = toast.loading("Deleting product...");
    try {
      const result: any = await deleteMutate({ url: `/product/delete-product/${prodId}`, payload: {} });
      if (result?.data) {
        refetch();
        toast.success(result.data.message, { id: toastId, duration: 1000 });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed", { id: toastId, duration: 1400 });
    }
  };

  const handleDuplicateProduct = async (product: TVendorProduct) => {
    const toastId = toast.loading("Duplicating Product...");
    try {
      const { shopId: sid, categoryId, name, price, description, inventoryCount, productImg } = product;
      const result: any = await duplicateMutate({
        url: "/product/duplicate-product",
        payload: { shopId: sid, categoryId, name, price, description, inventoryCount, productImg },
      });
      if (result?.data) {
        refetch();
        toast.success(result.data.message, { id: toastId, duration: 1000 });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed", { id: toastId, duration: 1400 });
    }
  };

  let content = null;

  if (shop?.status === "BLOCKED") {
    content = (
      <tr>
        <td colSpan={10} className="p-8 text-center text-red-500 font-medium">
          Your shop is blocked by the admin
        </td>
      </tr>
    );
  } else if (isLoading) {
    content = (
      <tr>
        <td colSpan={10} className="p-8 text-center text-gray-500">Loading...</td>
      </tr>
    );
  } else if (isError) {
    content = (
      <tr>
        <td colSpan={10} className="p-8 text-center text-red-500">Something went wrong</td>
      </tr>
    );
  } else if (products.length === 0) {
    content = (
      <tr>
        <td colSpan={10} className="p-8 text-center text-gray-500">Nothing Found</td>
      </tr>
    );
  } else {
    content = products.map((product) => (
      <tr key={product.id} className="border-b hover:bg-gray-50 transition-colors">
        <td className="p-4 text-center">{product.name}</td>
        <td className="p-4 text-center">
          <div className="flex justify-center">
            <div className="relative w-16 h-16 rounded overflow-hidden">
              <Image
                src={product.productImg || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          </div>
        </td>
        <td className="p-4 text-center">{product.category?.name}</td>
        <td className="p-4 text-center">${product.price}</td>
        <td className="p-4 text-center">{product.discount ? `$${product.discount}` : "N/A"}</td>
        <td className="p-4 text-center">{product.inventoryCount}</td>
        <td className="p-4 text-center">{product.shop?.name}</td>
        <td className="p-4 text-center">
          <Link href={`/dashboard/vendor/update-products/${product.id}`}>
            <Button className="px-4 font-semibold text-sm bg-prime100 hover:bg-prime100 active:scale-95 duration-500">
              Update
            </Button>
          </Link>
        </td>
        <td className="p-4 text-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="px-4 text-sm">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the product.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </td>
        <td className="p-4 text-center">
          <Button
            onClick={() => handleDuplicateProduct(product)}
            className="px-4 font-semibold text-sm bg-prime100 hover:bg-prime100 active:scale-95 duration-500"
          >
            Duplicate
          </Button>
        </td>
      </tr>
    ));
  }

  return (
    <>
      {(isLoading || deleteLoading || duplicateLoading) && <FormSubmitLoading />}

      <div className="ManageVendorProductContainer">
        <div className="ManageVendorProductWrapper bg-gray-100 border border-gray-300 shadow rounded-md p-3">
          <h3 className="text-2xl font-medium mb-4">Manage Product</h3>

          <div className="mb-6">
            <Button
              onClick={() => {
                if (shop?.status === "ACTIVE") router.push("/dashboard/vendor/add-products");
              }}
              disabled={shop?.status !== "ACTIVE"}
              className={`font-semibold text-sm duration-500 ${
                shop?.status === "ACTIVE"
                  ? "bg-prime100 hover:bg-prime100 cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Add Product
            </Button>
          </div>

          <div className="relative w-full overflow-auto mt-4">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="w-full text-sm bg-sky-100">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Image</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Discount</th>
                  <th className="px-4 py-3 font-medium">Inventory</th>
                  <th className="px-4 py-3 font-medium">Shop Name</th>
                  <th className="px-4 py-3 font-medium">Update</th>
                  <th className="px-4 py-3 font-medium">Delete</th>
                  <th className="px-4 py-3 font-medium">Duplicate</th>
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
