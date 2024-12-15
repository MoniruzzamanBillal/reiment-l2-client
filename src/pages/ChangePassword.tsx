import { ReimentForm, ReimentInput } from "@/components/form";
import { FormSubmitLoading } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useChangePasswordMutation } from "@/redux/features/auth/auth.api";
import { FieldValues } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleChangePassword = async (data: FieldValues) => {
    const { oldPassword, newPassword } = data;
    const toastId = toast.loading("Changing password...");

    const payload = {
      oldPassword,
      newPassword,
    };

    try {
      const result = await changePassword(payload);

      // console.log(result);
      // console.log(result?.data);

      //  *  for any  error
      if (result?.error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessage = (result?.error as any)?.data?.message;
        console.log(errorMessage);
        toast.error(errorMessage, {
          id: toastId,
          duration: 1400,
        });
      }

      // * for successful insertion
      if (result?.data) {
        toast.success("Password changed successfully", {
          id: toastId,
          duration: 1400,
        });

        setTimeout(() => {
          navigate("/");
        }, 700);
      }
    } catch (error) {
      console.log(error);
      toast.error("Password change failed", { id: toastId, duration: 1800 });
    }
  };

  return (
    <>
      {isLoading && <FormSubmitLoading />}

      <div className="ChangePasswordContainer w-full min-h-screen flex items-center justify-center">
        <div className="formContainer py-14 w-[95%] sm:w-[70%] md:w-[50%] m-auto p-3 sm:p-5 md:p-10 rounded-md shadow-xl bg-gray-200 backdrop-blur bg-opacity-60 border">
          <p className="text-xl sm:text-2xl text-center font-semibold mb-5">
            Change Your Password
          </p>

          {/* Form starts */}
          <ReimentForm onSubmit={handleChangePassword}>
            <ReimentInput
              type="password"
              label="Old Password"
              name="oldPassword"
              placeholder="Enter your current password"
            />
            <ReimentInput
              type="password"
              label="New Password"
              name="newPassword"
              placeholder="Enter a new password"
            />
            <Button
              disabled={isLoading}
              className={`px-5 py-2 font-semibold text-sm sm:text-base duration-500  ${
                isLoading
                  ? " cursor-not-allowed bg-gray-600 "
                  : "bg-prime50 hover:bg-prime100  "
              } `}
            >
              Change Password
            </Button>
          </ReimentForm>
          {/* Form ends */}
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
