import { ReimentForm, ReimentInput } from "@/components/form";
import { FieldValues } from "react-hook-form";
import { Button } from "../button";
import { toast } from "sonner";
import { useSignUpMutation } from "@/redux/features/auth/auth.api";
import { useNavigate } from "react-router-dom";

const UserRegisterForm = () => {
  const navigate = useNavigate();

  const [signUp, { isLoading: registerLoading }] = useSignUpMutation();

  // ! register user
  const handleRegisterUser = async (data: FieldValues) => {
    const { username, email, password, profileImg } = data;

    const payload = {
      role: "CUSTOMER",
      username,
      email,
      password,
    };

    const formData = new FormData();

    formData.append("data", JSON.stringify(payload));
    formData.append("profileImg", profileImg);

    try {
      const taostId = toast.loading("Registering new user ....");

      const result = await signUp(formData);

      //  *  for any  error
      if (result?.error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessage = (result?.error as any)?.data?.message;
        console.log(errorMessage);
        toast.error(errorMessage, {
          id: taostId,
          duration: 1400,
        });
      }

      // * for successful insertion
      if (result?.data) {
        const successMsg = result?.data?.message;

        toast.success(successMsg, {
          id: taostId,
          duration: 1000,
        });

        setTimeout(() => {
          navigate("/login");
        }, 700);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while Registering new user !!!", {
        duration: 1400,
      });
    }
  };

  return (
    <>
      <div className="UserRegisterFormContainer">
        {/* form starts  */}
        <ReimentForm onSubmit={handleRegisterUser}>
          <ReimentInput
            type="text"
            label="Username:"
            name="username"
            placeholder="Enter Your Username"
          />
          <ReimentInput
            type="email"
            label="Email:"
            name="email"
            placeholder="Enter Your Email"
          />

          <ReimentInput
            type="file"
            label="Profile Image:"
            name="profileImg"
            placeholder="Upload Your Profile Image"
          />

          <ReimentInput
            type="password"
            label="Password :"
            name="password"
            placeholder="Enter Your Password"
          />

          <Button
            disabled={registerLoading}
            className={`px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base  active:scale-95 duration-500 ${
              registerLoading
                ? " cursor-not-allowed bg-gray-600 "
                : "bg-prime50 hover:bg-prime100  "
            } `}
          >
            Register
          </Button>
        </ReimentForm>
        {/* form ends */}
      </div>
    </>
  );
};

export default UserRegisterForm;
