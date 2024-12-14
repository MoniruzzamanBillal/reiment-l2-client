import { z } from "zod";
import { ReimentForm, ReimentInput } from "@/components/form";
import Wrapper from "@/components/shared/Wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues } from "react-hook-form";
import { Button } from "@/components/ui/button";

const ForgotPassword = () => {
  const handleResetPassword = async (data: FieldValues) => {
    console.log(data);
  };

  return (
    <div className="ForgotPasswordContainer">
      <Wrapper className="ForgotPasswordWrapper py-14 ">
        {/*  */}
        <div className=" w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[70%] xmd:w-[65%] lg:w-[55%] m-auto p-3 xsm:p-5 sm:p-7 md:p-10  rounded-md shadow-xl bg-gray-200 dark:bg-black100 backdrop-blur bg-opacity-60 dark:backdrop-blur  ">
          <p className=" mb-3 xsm:mb-5 sm:mb-8 text-xl xsm:text-2xl sm:text-3xl text-center font-semibold CormorantFont text-gray-700 dark:text-white  ">
            Reset Password
          </p>

          {/*  */}

          {/* form starts  */}
          <ReimentForm
            onSubmit={handleResetPassword}
            resolver={zodResolver(
              z.object({
                email: z.string().min(1, "Email is required"),
              })
            )}
          >
            <ReimentInput
              type="email"
              label="Email :"
              name="email"
              placeholder="Enter your email"
            />

            {/* ${
                isLoading
                  ? " cursor-not-allowed bg-gray-600 "
                  : "bg-prime50 hover:bg-prime100  "
              } */}

            <Button
              //   disabled={isLoading}
              className={`px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base  active:scale-95 duration-500  `}
            >
              Next
            </Button>
          </ReimentForm>
          {/* form ends */}

          {/*  */}
        </div>
        {/*  */}
      </Wrapper>
    </div>
  );
};

export default ForgotPassword;
