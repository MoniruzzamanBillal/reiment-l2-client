"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { usePatch } from "@/hooks/useApi";
import { changePasswordSchema } from "@/schemas/auth.schema";
import ControlledInput from "@/components/shared/input/ControlledInput";
import { Button } from "@/components/ui/button";
import FormSubmitLoading from "@/components/shared/ui/FormSubmitLoading";

type TChangePassword = z.infer<typeof changePasswordSchema>;

const ChangePasswordForm = () => {
  const router = useRouter();
  const { mutateAsync: changePassword, isPending } = usePatch([]);

  const methods = useForm<TChangePassword>({
    resolver: zodResolver(changePasswordSchema),
  });

  const handleChangePassword = async (data: TChangePassword) => {
    const toastId = toast.loading("Changing password...");
    try {
      await changePassword({
        url: "/auth/change1st-password",
        payload: data,
      });

      toast.success("Password changed successfully", {
        id: toastId,
        duration: 1400,
      });
      setTimeout(() => router.push("/"), 700);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (error as any)?.message || "Password change failed";
      toast.error(msg, { id: toastId, duration: 1800 });
    }
  };

  return (
    <>
      {isPending && <FormSubmitLoading />}

      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="w-[95%] sm:w-[70%] md:w-[50%] mx-auto p-6 sm:p-10 rounded-md shadow-xl bg-white border border-gray-200">
          <h1 className="text-xl sm:text-2xl text-center font-semibold mb-6 text-gray-700">
            Change Your Password
          </h1>

          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(handleChangePassword)}
              className="space-y-4"
            >
              <ControlledInput
                name="oldPassword"
                type="password"
                label="Old Password"
                placeholder="Enter your current password"
                isRequired
              />
              <ControlledInput
                name="newPassword"
                type="password"
                label="New Password"
                placeholder="Enter a new password"
                isRequired
              />

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold"
              >
                Change Password
              </Button>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
};

export default ChangePasswordForm;
