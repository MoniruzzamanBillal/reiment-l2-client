"use client";

import FormSubmitLoading from "@/components/shared/FormSubmitLoading";
import { Button } from "@/components/ui/button";
import { useFetchData } from "@/hooks/useApi";
import { TVendorShop } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ManageVendorShopPage() {
  const router = useRouter();

  const {
    data: shopData,
    isLoading,
    isError,
  } = useFetchData<TVendorShop>(["vendorShop"], "/shop/vendor-shop");

  const shop: TVendorShop | null = (shopData as any)?.data ?? null;

  let content = null;

  if (isLoading) {
    content = (
      <tr>
        <td colSpan={4} className="p-8 text-center text-gray-500">
          Loading...
        </td>
      </tr>
    );
  } else if (isError) {
    content = (
      <tr>
        <td colSpan={4} className="p-8 text-center text-red-500">
          Something went wrong
        </td>
      </tr>
    );
  } else if (shop) {
    content = (
      <tr key={shop.id} className="border-b">
        <td className="p-4 text-center">{shop.name}</td>
        <td className="p-4 text-center">
          <div className="flex justify-center items-center">
            <div className="relative size-[4.4rem] rounded-md overflow-hidden">
              <Image
                src={shop.logo || "/placeholder.svg"}
                alt={shop.name}
                fill
                className="object-cover"
                sizes="70px"
              />
            </div>
          </div>
        </td>
        <td
          className={`p-4 text-center font-semibold ${
            shop.status === "ACTIVE" ? "text-green-500" : "text-red-500"
          }`}
        >
          {shop.status}
        </td>
        <td className="p-4 text-center">
          <Button
            onClick={() => {
              if (shop.status === "ACTIVE") {
                router.push(`/dashboard/vendor/update-shop/${shop.id}`);
              }
            }}
            disabled={shop.status !== "ACTIVE"}
            className={`font-semibold text-sm duration-500 ${
              shop.status === "ACTIVE"
                ? "bg-prime100 hover:bg-prime100 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Update
          </Button>
        </td>
      </tr>
    );
  }

  return (
    <>
      {isLoading && <FormSubmitLoading />}

      <div className="ManageVendorShopContainer">
        <div className="ManageVendorShopWrapper bg-gray-100 border border-gray-300 shadow rounded-md p-3">
          <h3 className="text-2xl font-medium mb-8">Manage Shop</h3>

          {!shop && !isLoading && (
            <div className="mb-6">
              <Link href="/dashboard/vendor/add-shop">
                <Button className="font-semibold text-sm bg-prime50 hover:bg-prime100 active:scale-95 duration-500">
                  Create Shop
                </Button>
              </Link>
            </div>
          )}

          {(shop || isLoading) && (
            <div className="relative w-full overflow-auto mt-4">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr className="w-full text-sm bg-sky-100">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Logo</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Update</th>
                  </tr>
                </thead>
                <tbody>{content}</tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
