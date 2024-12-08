import { ReimentForm, ReimentInput } from "@/components/form";

import { Button } from "@/components/ui/button";
import { FieldValues } from "react-hook-form";

import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { FormSubmitLoading } from "@/components/ui";

const Checkout = () => {
  const navigate = useNavigate();

  const handleAddAddress = async (data: FieldValues) => {
    console.log(data);
  };

  return (
    <>
      {/* {isLoading && <FormSubmitLoading />} */}

      <div className="CheckoutContainer py-8 bg-gray-100 min-h-screen p-3 shadow rounded-md">
        <div className="CheckoutWrapper">
          <h1 className="mb-8 px-3 xsm:px-4 sm:px-5 md:px-6 font-bold text-2xl md:text-3xl text-center">
            Checkout
          </h1>

          <div className="checkoutForm p-1 w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[70%] xmd:w-[65%] lg:w-[55%] m-auto">
            <ReimentForm onSubmit={handleAddAddress}>
              <ReimentInput
                type="text"
                label="Street Address :"
                name="street"
                placeholder="Enter your street address"
              />

              <ReimentInput
                type="text"
                label="City :"
                name="city"
                placeholder="Enter your city"
              />

              <ReimentInput
                type="text"
                label="State :"
                name="state"
                placeholder="Enter your state"
              />

              <ReimentInput
                type="text"
                label="Postal Code :"
                name="postalCode"
                placeholder="Enter your postal code"
              />

              <ReimentInput
                type="text"
                label="Country :"
                name="country"
                placeholder="Enter your country"
              />

              <Button
                className={`px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base active:scale-95 duration-500 bg-prime50 hover:bg-prime100`}
              >
                Place Order
              </Button>
            </ReimentForm>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
