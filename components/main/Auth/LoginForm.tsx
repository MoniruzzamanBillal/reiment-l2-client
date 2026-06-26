"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { usePost } from "@/hooks/useApi";
import { useAuthStore } from "@/stores/useAuthStore";
import { decodeToken } from "@/utils/tokenUtils";
import { authKey } from "@/utils/constants/storageKey";
import { loginSchema } from "@/schemas/auth.schema";
import ControlledInput from "@/components/shared/input/ControlledInput";
import { Button } from "@/components/ui/button";
import FormSubmitLoading from "@/components/shared/ui/FormSubmitLoading";

type TLoginForm = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { mutateAsync: loginMutate, isPending } = usePost([]);

  const methods = useForm<TLoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: TLoginForm) => {
    const toastId = toast.loading("Logging in...");
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await loginMutate({
        url: "/auth/log-in",
        payload: data,
      });

      const responseData = result?.data;
      const token: string = responseData?.token;

      if (!token) throw new Error("No token received");

      const user = decodeToken(token);
      if (!user) throw new Error("Invalid token");

      Cookies.set(authKey, token, { expires: 7 });
      setAuth(user, token);

      toast.success(responseData?.message || "Login successful", {
        id: toastId,
        duration: 1400,
      });

      if (responseData?.data?.needsPasswordChange) {
        router.push("/change-password");
        return;
      }

      if (user.userRole === "ADMIN") {
        router.push("/dashboard/admin/statistics");
      } else if (user.userRole === "VENDOR") {
        router.push("/dashboard/vendor/manage-shop");
      } else {
        router.push("/");
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMsg = (error as any)?.message || "Login failed";
      toast.error(errorMsg, { id: toastId, duration: 1800 });
    }
  };

  return (
    <>
      {isPending && <FormSubmitLoading />}

      <div className="w-full min-h-screen flex items-center justify-center py-14">
        <div className="w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[60%] lg:w-[45%] mx-auto p-6 sm:p-10 rounded-md shadow-xl bg-white border border-gray-200">
          <h1 className="mb-6 text-2xl sm:text-3xl text-center font-semibold text-gray-700">
            Log in
          </h1>

          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(handleLogin)}
              className="space-y-4"
            >
              <ControlledInput
                name="email"
                type="email"
                label="Email"
                placeholder="Enter your email"
                isRequired
              />
              <ControlledInput
                name="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                isRequired
              />

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold"
              >
                Log in
              </Button>
            </form>
          </FormProvider>

          <div className="mt-3">
            <Link
              href="/forgot-password"
              className="text-sm font-semibold underline text-blue-700 hover:text-blue-800"
            >
              Forgot password?
            </Link>
          </div>

          <div className="text-center mt-5 text-sm text-gray-700">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-blue-700 font-bold hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
