"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import Cookies from "js-cookie";
import { usePost } from "@/hooks/useApi";
import { useAuthStore } from "@/stores/useAuthStore";
import { decodeToken } from "@/utils/tokenUtils";
import { authKey } from "@/utils/constants/storageKey";
import { registerVendorSchema } from "@/schemas/auth.schema";
import ControlledInput from "@/components/shared/input/ControlledInput";
import { Button } from "@/components/ui/button";
import FormSubmitLoading from "@/components/shared/ui/FormSubmitLoading";

type TRegisterVendor = z.infer<typeof registerVendorSchema>;

const VendorRegisterForm = () => {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { mutateAsync: signUp, isPending } = usePost([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const methods = useForm<TRegisterVendor>({
    resolver: zodResolver(registerVendorSchema),
  });

  const handleRegister = async (data: TRegisterVendor) => {
    const toastId = toast.loading("Registering vendor...");

    const payload = { role: "VENDOR", ...data };
    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));

    const file = fileRef.current?.files?.[0];
    if (file) formData.append("profileImg", file);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await signUp({
        url: "/auth/create-user",
        payload: formData,
      });

      const token: string = result?.data?.token;

      toast.success(result?.data?.message || "Registration successful", {
        id: toastId,
        duration: 1000,
      });

      if (token) {
        const user = decodeToken(token);
        if (user) {
          Cookies.set(authKey, token, { expires: 7 });
          setAuth(user, token);
        }
        setTimeout(() => router.push("/dashboard/vendor/manage-shop"), 700);
      } else {
        setTimeout(() => router.push("/login"), 700);
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (error as any)?.message || "Registration failed";
      toast.error(msg, { id: toastId, duration: 1400 });
    }
  };

  return (
    <>
      {isPending && <FormSubmitLoading />}

      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(handleRegister)}
          className="space-y-4"
        >
          <ControlledInput
            name="username"
            label="Username"
            placeholder="Enter your username"
            isRequired
          />
          <ControlledInput
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            isRequired
          />

          <div className="space-y-1">
            <label className="text-sm font-medium">Profile Image</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            />
          </div>

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
            Register as Vendor
          </Button>
        </form>
      </FormProvider>
    </>
  );
};

export default VendorRegisterForm;
