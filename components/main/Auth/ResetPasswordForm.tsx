"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { usePatch } from "@/hooks/useApi";
import { resetPasswordSchema } from "@/schemas/auth.schema";
import { decodeToken } from "@/utils/tokenUtils";
import ControlledInput from "@/components/shared/input/ControlledInput";
import { Button } from "@/components/ui/button";
import FormSubmitLoading from "@/components/shared/ui/FormSubmitLoading";

type TResetPassword = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm = ({ token }: { token: string }) => {
  const router = useRouter();
  const { mutateAsync: resetPassword, isPending } = usePatch([]);

  const methods = useForm<TResetPassword>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const handleResetPassword = async (data: TResetPassword) => {
    const toastId = toast.loading("Resetting password...");
    try {
      const decoded = decodeToken(token);
      const userId = decoded?.userId;

      if (!userId) throw new Error("Invalid reset token");

      await resetPassword({
        url: "/auth/reset-password",
        payload: { userId, password: data.password },
      });

      toast.success("Password reset successfully", {
        id: toastId,
        duration: 1000,
      });
      router.push("/login");
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (error as any)?.message || "Password reset failed";
      toast.error(msg, { id: toastId, duration: 1800 });
    }
  };

  return (
    <>
      {isPending && <FormSubmitLoading />}

      <div className="w-full min-h-screen flex items-center justify-center py-14">
        <div className="w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[60%] lg:w-[45%] mx-auto p-6 sm:p-10 rounded-md shadow-xl bg-white border border-gray-200">
          <h1 className="mb-6 text-2xl sm:text-3xl text-center font-semibold text-gray-700">
            Reset Password
          </h1>

          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(handleResetPassword)}
              className="space-y-4"
            >
              <ControlledInput
                name="password"
                type="password"
                label="New Password"
                placeholder="Enter your new password"
                isRequired
              />
              <ControlledInput
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="Confirm your password"
                isRequired
              />

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold"
              >
                Reset Password
              </Button>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordForm;
