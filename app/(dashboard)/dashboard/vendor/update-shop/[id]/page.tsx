"use client";

import FormSubmitLoading from "@/components/shared/FormSubmitLoading";
import ControlledInput from "@/components/shared/input/ControlledInput";
import { FileUploadController } from "@/components/shared/input/FileUploadController";
import ControlledTextArea from "@/components/shared/input/ControlledTextArea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchData, usePatch } from "@/hooks/useApi";
import { TVendorShop } from "@/types";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function UpdateShopPage() {
  const router = useRouter();

  const { data: shopData, isLoading: shopLoading } = useFetchData<TVendorShop>(
    ["vendorShop"],
    "/shop/vendor-shop"
  );
  const shop: TVendorShop | null = (shopData as any)?.data ?? null;

  const { mutateAsync: updateMutate, isPending } = usePatch([["vendorShop"]]);

  const methods = useForm({
    values: {
      name: shop?.name ?? "",
      description: shop?.description ?? "",
      logo: undefined as any,
    },
  });

  const handleUpdateShop = async (data: any) => {
    const toastId = toast.loading("Updating shop...");
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify({ name: data.name, description: data.description }));
      if (data.logo instanceof File) formData.append("logo", data.logo);

      const result: any = await updateMutate({ url: `/shop/update-shop/${shop?.id}`, payload: formData });
      if (result?.data) {
        toast.success(result.data.message, { id: toastId, duration: 1000 });
        setTimeout(() => router.push("/dashboard/vendor/manage-shop"), 700);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong", { id: toastId, duration: 1400 });
    }
  };

  return (
    <>
      {(shopLoading || isPending) && <FormSubmitLoading />}

      <div className="AddCategoryContainer py-8 bg-gray-100 border border-gray-300 p-3 shadow rounded-md">
        <div className="AddCategoryWrapper">
          <h1 className="mb-8 px-3 font-bold text-2xl md:text-3xl text-center">Update Shop</h1>

          <div className="p-1 w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[70%] xmd:w-[65%] lg:w-[55%] m-auto">
            {shopLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(handleUpdateShop)} className="space-y-5">
                  <ControlledInput name="name" label="Shop Name :" placeholder="Enter Shop Name" />
                  <FileUploadController name="logo" label="Shop Logo :" />
                  <ControlledTextArea name="description" label="Shop Description :" placeholder="Enter Shop Description" />
                  <Button type="submit" disabled={isPending} className="font-semibold text-sm active:scale-95 duration-500 bg-prime50 hover:bg-prime100">
                    Update Shop
                  </Button>
                </form>
              </FormProvider>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
