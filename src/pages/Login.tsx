import { ReimentForm, ReimentInput } from "@/components/form";
import Wrapper from "@/components/shared/Wrapper";
import { Button } from "@/components/ui/button";
import loginSchema from "@/schemas/login.schema";
import { FieldValues } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogInMutation } from "@/redux/features/auth/auth.api";
import { FormSubmitLoading } from "@/components/ui";
import { verifyToken } from "@/utils/verifyToken";
import { TUser } from "@/types/globalTypes";
import { useAppDispatch } from "@/redux/hook";
import { setUser } from "@/redux/features/auth/auth.slice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logIn, { isLoading }] = useLogInMutation();

  // ! for login
  const handleLogin = async (data: FieldValues) => {
    const { email, password } = data;

    const toastId = toast.loading("Loginng in...");

    try {
      const payload = {
        email,
        password,
      };

      const result = await logIn(payload).unwrap();

      if (result?.success) {
        const token = result?.token;

        const user = verifyToken(token) as TUser;

        dispatch(setUser({ user, token }));

        toast.success(result?.message, { id: toastId, duration: 1400 });

        navigate("/", {
          replace: true,
        });
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMsg = (error as any)?.data?.message;
      toast.error(errorMsg, { id: toastId, duration: 1800 });
      console.log(error);
    }
  };

  return (
    <>
      {isLoading && <FormSubmitLoading />}

      <div className="LoginContainer w-full min-h-screen  imageCenter flex items-center justify-center    ">
        <Wrapper className="formContainer py-14  ">
          <div className="    w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[70%] xmd:w-[65%] lg:w-[55%] m-auto p-3 xsm:p-5 sm:p-7 md:p-10  rounded-md shadow-xl bg-gray-200  backdrop-blur bg-opacity-60 border   ">
            <p className=" mb-3 xsm:mb-5 sm:mb-8 text-xl xsm:text-2xl sm:text-3xl text-center font-semibold CormorantFont text-gray-700   ">
              Log in
            </p>

            {/*  */}

            {/* form starts  */}
            <ReimentForm
              onSubmit={handleLogin}
              resolver={zodResolver(loginSchema)}
            >
              <ReimentInput
                type="email"
                label="Email :"
                name="email"
                placeholder="Enter Your Email"
              />

              <ReimentInput
                type="password"
                label="Password :"
                name="password"
                placeholder="Enter Your Password"
              />

              {/* ${
              isLoading
                ? " cursor-not-allowed bg-gray-300  "
                : " bg-prime50 hover:bg-prime100"
            } */}

              <Button
                // disabled={isLoading}
                className={`px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base  active:scale-95 duration-500  `}
              >
                Log in
              </Button>
            </ReimentForm>
            {/* form ends */}

            <div className="forgotPassword  mt-2  font-semibold underline cursor-pointer text-blue-800 dark:text-blue-500  ">
              <Link to={"/forgotPassword"}>forgot password</Link>
            </div>

            {/*  */}

            <div className="text-center  mt-6  ">
              <a className="right-0 inline-block text-sm font-semibold align-baseline text-gray-900 hover:text-gray-950   ">
                Don't have any account ?{" "}
                <span className=" text-blue-700 font-bold cursor-pointer ">
                  <Link to={`/sign-up`}>Sign up </Link>
                </span>
              </a>
            </div>
          </div>
        </Wrapper>
      </div>
    </>
  );
};

export default Login;
