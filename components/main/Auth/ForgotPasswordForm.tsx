"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { usePatch } from "@/hooks/useApi";
import { forgotPasswordSchema } from "@/schemas/auth.schema";
import ControlledInput from "@/components/shared/input/ControlledInput";
import { Button } from "@/components/ui/button";
import FormSubmitLoading from "@/components/shared/ui/FormSubmitLoading";

type TForgotPassword = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = () => {
  const router = useRouter();
  const { mutateAsync: sendResetLink, isPending } = usePatch([]);

  const methods = useForm<TForgotPassword>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const handleSendEmail = async (data: TForgotPassword) => {
    const toastId = toast.loading("Sending password reset link...");
    try {
      await sendResetLink({
        url: `/auth/reset-link/${data.email}`,
        payload: {},
      });

      toast.success("Reset link sent successfully", {
        id: toastId,
        duration: 1000,
      });
      router.push(`/email-reset-confirmation/${data.email}`);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (error as any)?.message || "Something went wrong";
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
              onSubmit={methods.handleSubmit(handleSendEmail)}
              className="space-y-4"
            >
              <ControlledInput
                name="email"
                type="email"
                label="Email"
                placeholder="Enter your email"
                isRequired
              />

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold"
              >
                Send Reset Link
              </Button>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordForm;
