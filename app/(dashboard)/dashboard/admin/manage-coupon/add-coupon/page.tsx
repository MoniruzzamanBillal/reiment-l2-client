"use client";

import FormSubmitLoading from "@/components/shared/FormSubmitLoading";
import ControlledInput from "@/components/shared/input/ControlledInput";
import { Button } from "@/components/ui/button";
import { usePost } from "@/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const addCouponSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
  discountValue: z.string().min(1, "Discount value is required"),
  usageLimit: z.string().min(1, "Usage limit is required"),
});
type TAddCouponForm = z.infer<typeof addCouponSchema>;

export default function AddCouponPage() {
  const router = useRouter();
  const { mutateAsync: addMutate, isPending } = usePost([["allCoupon"]]);

  const methods = useForm<TAddCouponForm>({ resolver: zodResolver(addCouponSchema) });

  const handleAddCoupon = async (data: TAddCouponForm) => {
    try {
      const result = await addMutate({
        url: "/coupon/add-coupon",
        payload: { code: data.code, discountValue: data.discountValue, usageLimit: data.usageLimit },
      });
      if (result?.data?.success) {
        toast.success(result.data.message, { duration: 1200 });
        setTimeout(() => router.push("/dashboard/admin/manage-coupon"), 600);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong", { duration: 1400 });
    }
  };

  return (
    <>
      {isPending && <FormSubmitLoading />}
      <div className="AddCouponContainer py-8 bg-gray-100 border border-gray-200 p-3 shadow rounded-md">
        <div className="AddCouponWrapper">
          <h1 className="mb-8 px-3 font-bold text-2xl md:text-3xl text-center">Add Coupon</h1>
          <div className="p-1 w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[70%] xmd:w-[65%] lg:w-[55%] m-auto">
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(handleAddCoupon)} className="space-y-5">
                <ControlledInput name="code" label="Coupon Code :" placeholder="Enter Coupon Code" />
                <ControlledInput name="discountValue" type="number" label="Discount Value (%) :" placeholder="e.g. 10 for 10%" />
                <ControlledInput name="usageLimit" type="number" label="Usage Limit :" placeholder="Enter Usage Limit" />
                <Button type="submit" disabled={isPending} className="font-semibold text-sm active:scale-95 duration-500 bg-prime50 hover:bg-prime100">
                  Add Coupon
                </Button>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </>
  );
}
