/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReimentForm, ReimentInput } from "@/components/form";
import { FormSubmitLoading } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useAddCouponMutation } from "@/redux/features/cupon/coupon.api";
import { FieldValues } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddCoupon = () => {
  const navigate = useNavigate();
  const [addCoupon, { isLoading }] = useAddCouponMutation();

  const handleAddCoupon = async (data: FieldValues) => {
    const { code, discountValue, usageLimit } = data;

    const payload = {
      code,
      discountValue: parseFloat(discountValue),
      usageLimit: parseFloat(usageLimit),
    };

    const result = await addCoupon(payload);

    // Handle errors
    if (result?.error) {
      const errorMessage = (result?.error as any)?.data?.message;
      console.log(errorMessage);
      toast.error(errorMessage, {
        duration: 1400,
      });
    }

    // Handle success
    if (result?.data?.success) {
      toast.success(result?.data?.message, { duration: 1200 });

      setTimeout(() => {
        navigate("/dashboard/admin/manage-coupon");
      }, 600);
    }
  };

  return (
    <>
      {isLoading && <FormSubmitLoading />}

      <div className="AddCouponContainer py-8 bg-gray-100 border border-gray-200 p-3 shadow rounded-md">
        <div className="AddCouponWrapper">
          <h1 className="mb-8 px-3 xsm:px-4 sm:px-5 md:px-6 font-bold text-2xl md:text-3xl text-center">
            Add Coupon
          </h1>

          {/* Add coupon form container starts */}
          <div className="addCouponForm p-1 w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[70%] xmd:w-[65%] lg:w-[55%] m-auto">
            <ReimentForm onSubmit={handleAddCoupon}>
              <ReimentInput
                type="text"
                label="Coupon Code :"
                name="code"
                placeholder="Enter Coupon Code"
              />
              <ReimentInput
                type="number"
                label="Discount Value (%):"
                name="discountValue"
                placeholder="Enter Discount Value (e.g., 10 for 10%)"
              />
              <ReimentInput
                type="number"
                label="Usage Limit :"
                name="usageLimit"
                placeholder="Enter Usage Limit"
              />
              <Button
                className={`px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base active:scale-95 duration-500 bg-prime50 hover:bg-prime100`}
              >
                Add Coupon
              </Button>
            </ReimentForm>
          </div>
          {/* Add coupon form container ends */}
        </div>
      </div>
    </>
  );
};

export default AddCoupon;
