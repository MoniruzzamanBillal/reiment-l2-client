"use client";

import FormSubmitLoading from "@/components/shared/FormSubmitLoading";
import ControlledInput from "@/components/shared/input/ControlledInput";
import { FileUploadController } from "@/components/shared/input/FileUploadController";
import { Button } from "@/components/ui/button";
import { usePost } from "@/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const addCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  categoryImg: z.any().refine((f) => f instanceof File && f.size > 0, { message: "Category image is required" }),
});
type TAddCategoryForm = z.infer<typeof addCategorySchema>;

export default function AddCategoryPage() {
  const router = useRouter();
  const { mutateAsync: addMutate, isPending } = usePost([["allCategory"]]);

  const methods = useForm<TAddCategoryForm>({ resolver: zodResolver(addCategorySchema) });

  const handleAddCategory = async (data: TAddCategoryForm) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify({ name: data.name }));
    formData.append("categoryImg", data.categoryImg);

    try {
      const result: any = await addMutate({ url: "/category/add-category", payload: formData });
      if (result?.data?.success) {
        toast.success(result.data.message, { duration: 1200 });
        setTimeout(() => router.push("/dashboard/admin/categories"), 600);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong", { duration: 1400 });
    }
  };

  return (
    <>
      {isPending && <FormSubmitLoading />}
      <div className="AddCategoryContainer py-8 bg-gray-100 border border-gray-200 p-3 shadow rounded-md">
        <div className="AddCategoryWrapper">
          <h1 className="mb-8 px-3 font-bold text-2xl md:text-3xl text-center">Add Category</h1>
          <div className="p-1 w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[70%] xmd:w-[65%] lg:w-[55%] m-auto">
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(handleAddCategory)} className="space-y-5">
                <ControlledInput name="name" label="Category Name :" placeholder="Enter Category Name" />
                <FileUploadController name="categoryImg" label="Category Image :" />
                <Button type="submit" disabled={isPending} className="font-semibold text-sm active:scale-95 duration-500 bg-prime50 hover:bg-prime100">
                  Add Category
                </Button>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </>
  );
}
