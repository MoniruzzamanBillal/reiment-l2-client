import { ReimentForm, ReimentInput } from "@/components/form";
import Wrapper from "@/components/shared/Wrapper";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  console.log(token);

  const handleResetPassword = async (data: FieldValues) => {
    console.log(data);
  };

  return (
    <div className="ResetPasswordContainer w-full min-h-screen flex items-center justify-center">
      <Wrapper className="ResetPasswordWrapper py-14">
        {/*  */}
        <div className=" w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[70%] xmd:w-[65%] lg:w-[55%] m-auto p-3 xsm:p-5 sm:p-7 md:p-10  rounded-md shadow-xl bg-gray-200 dark:bg-black100 backdrop-blur bg-opacity-60 dark:backdrop-blur  ">
          <p className=" mb-3 xsm:mb-5 sm:mb-8 text-xl xsm:text-2xl sm:text-3xl text-center font-semibold CormorantFont text-gray-700 dark:text-white  ">
            Reset Password
          </p>

          {/*  */}

          {/* form starts  */}
          <ReimentForm onSubmit={handleResetPassword}>
            <ReimentInput
              type="password"
              label="Password :"
              name="password"
              placeholder="Enter your password "
            />
            <ReimentInput
              type="password"
              label="Confirm Password :"
              name="confirmPassword"
              placeholder="Confirm your password "
            />

            {/* ${
              isLoading
                ? " cursor-not-allowed bg-gray-600 "
                : "bg-prime50 hover:bg-prime100  "
            } */}

            <Button
              // disabled={isLoading}
              className={`px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base active:scale-95 duration-500 `}
            >
              Reset Password
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

export default ResetPassword;
