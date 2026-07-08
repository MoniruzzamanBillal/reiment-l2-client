"use client";

import FormSubmitLoading from "@/components/shared/FormSubmitLoading";
import ControlledInput from "@/components/shared/input/ControlledInput";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchData, usePatch } from "@/hooks/useApi";
import { TCoupon } from "@/types";
import { use } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UpdateCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const { data: couponData, isLoading } = useFetchData<TCoupon>(
    ["coupon", id], `/coupon/get-coupon/${id}`, { enabled: !!id }
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const coupon: TCoupon | null = (couponData as any)?.data ?? null;

  const { mutateAsync: updateMutate, isPending } = usePatch([["allCoupon"]]);

  const methods = useForm({
    values: {
      code: coupon?.code ?? "",
      discountValue: coupon?.discountValue?.toString() ?? "",
      usageLimit: coupon?.usageLimit?.toString() ?? "",
      startDate: coupon?.startDate ? coupon.startDate.slice(0, 10) : "",
      endDate: coupon?.endDate ? coupon.endDate.slice(0, 10) : "",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdateCoupon = async (data: any) => {
    const toastId = toast.loading("Updating Coupon...", { duration: 1000 });
    try {
      const payload = {
        code: data.code,
        discountValue: Number(data.discountValue),
        usageLimit: Number(data.usageLimit),
        startDate: data.startDate,
        endDate: data.endDate,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await updateMutate({ url: `/coupon/update-coupon/${id}`, payload });
      if (result?.success) {
        toast.success(result.message, { id: toastId, duration: 1000 });
        setTimeout(() => router.push("/dashboard/admin/manage-coupon"), 1000);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong", { id: toastId, duration: 1400 });
    }
  };

  return (
    <>
      {(isLoading || isPending) && <FormSubmitLoading />}
      <div className="AddCategoryContainer py-8 bg-gray-100 border border-gray-200 p-3 shadow rounded-md">
        <div className="AddCategoryWrapper">
          <h1 className="mb-8 px-3 font-bold text-2xl md:text-3xl text-center">Update Coupon</h1>
          <div className="p-1 w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[70%] xmd:w-[65%] lg:w-[55%] m-auto">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(handleUpdateCoupon)} className="space-y-5">
                  <ControlledInput name="code" label="Coupon Code :" placeholder="Enter Coupon Code" />
                  <ControlledInput name="discountValue" type="number" label="Discount Amount ($) :" placeholder="e.g. 10 for $10 off" />
                  <ControlledInput name="usageLimit" type="number" label="Usage Limit :" placeholder="Enter Usage Limit" />
                  <ControlledInput name="startDate" type="date" label="Start Date :" />
                  <ControlledInput name="endDate" type="date" label="End Date :" />
                  <Button type="submit" disabled={isPending} className="font-semibold text-sm active:scale-95 duration-500 bg-prime50 hover:bg-prime100">
                    Update Coupon
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
