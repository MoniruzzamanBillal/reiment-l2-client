"use client";

import FormSubmitLoading from "@/components/shared/FormSubmitLoading";
import ControlledInput from "@/components/shared/input/ControlledInput";
import { FileUploadController } from "@/components/shared/input/FileUploadController";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchData, usePatch } from "@/hooks/useApi";
import { TCategory } from "@/types";
import { use } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UpdateCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const { data: categoryData, isLoading } = useFetchData<TCategory>(
    ["category", id], `/category/category/${id}`, { enabled: !!id }
  );
  const category: TCategory | null = (categoryData as any)?.data ?? null;

  const { mutateAsync: updateMutate, isPending } = usePatch([["allCategory"]]);

  const methods = useForm({
    values: { name: category?.name ?? "", categoryImg: undefined as any },
  });

  const handleUpdateCategory = async (data: any) => {
    const toastId = toast.loading("Updating Category...", { duration: 1000 });
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify({ name: data.name }));
      if (data.categoryImg instanceof File) formData.append("categoryImg", data.categoryImg);

      const result: any = await updateMutate({ url: `/category/update-category/${id}`, payload: formData });
      if (result?.data) {
        toast.success(result.data.message, { id: toastId, duration: 1000 });
        setTimeout(() => router.push("/dashboard/admin/categories"), 1000);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong", { id: toastId, duration: 1400 });
    }
  };

  return (
    <>
      {(isLoading || isPending) && <FormSubmitLoading />}
      <div className="AddCategoryContainer py-8 bg-gray-100 border border-gray-200 p-3 shadow rounded-md">
        <div className="AddCategoryWrapper">
          <h1 className="mb-8 px-3 font-bold text-2xl md:text-3xl text-center">Update Category</h1>
          <div className="p-1 w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[70%] xmd:w-[65%] lg:w-[55%] m-auto">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(handleUpdateCategory)} className="space-y-5">
                  <ControlledInput name="name" label="Category Name :" placeholder="Enter Category Name" />
                  <FileUploadController name="categoryImg" label="Category Image :" />
                  <Button type="submit" disabled={isPending} className="font-semibold text-sm active:scale-95 duration-500 bg-prime50 hover:bg-prime100">
                    Update Category
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
