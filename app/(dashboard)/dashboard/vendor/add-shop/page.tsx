"use client";

import FormSubmitLoading from "@/components/shared/FormSubmitLoading";
import ControlledInput from "@/components/shared/input/ControlledInput";
import { FileUploadController } from "@/components/shared/input/FileUploadController";
import ControlledTextArea from "@/components/shared/input/ControlledTextArea";
import { Button } from "@/components/ui/button";
import { usePost } from "@/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const addShopSchema = z.object({
  name: z.string().min(1, "Shop name is required"),
  description: z.string().min(1, "Description is required"),
  logo: z.any().refine((f) => f instanceof File && f.size > 0, {
    message: "Shop logo is required",
  }),
});

type TAddShopForm = z.infer<typeof addShopSchema>;

export default function AddShopPage() {
  const router = useRouter();
  const { mutateAsync: addShopMutate, isPending } = usePost([["vendorShop"]]);

  const methods = useForm<TAddShopForm>({
    resolver: zodResolver(addShopSchema),
  });

  const handleAddShop = async (data: TAddShopForm) => {
    const toastId = toast.loading("Creating Shop...");
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify({ name: data.name, description: data.description }));
      formData.append("logo", data.logo);

      const result: any = await addShopMutate({ url: "/shop/create-shop", payload: formData });
      if (result?.data) {
        toast.success(result.data.message, { id: toastId, duration: 1000 });
        setTimeout(() => router.push("/dashboard/vendor/manage-shop"), 600);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong", { id: toastId, duration: 1400 });
    }
  };

  return (
    <>
      {isPending && <FormSubmitLoading />}

      <div className="AddCategoryContainer py-8 bg-gray-100 border border-gray-300 p-3 shadow rounded-md">
        <div className="AddCategoryWrapper">
          <h1 className="mb-8 px-3 font-bold text-2xl md:text-3xl text-center">Add Shop</h1>

          <div className="p-1 w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[70%] xmd:w-[65%] lg:w-[55%] m-auto">
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(handleAddShop)} className="space-y-5">
                <ControlledInput name="name" label="Shop Name :" placeholder="Enter Shop Name" />
                <FileUploadController name="logo" label="Shop Logo :" />
                <ControlledTextArea name="description" label="Shop Description :" placeholder="Enter Shop Description" />
                <Button type="submit" disabled={isPending} className="font-semibold text-sm active:scale-95 duration-500 bg-prime50 hover:bg-prime100">
                  Add Shop
                </Button>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </>
  );
}
