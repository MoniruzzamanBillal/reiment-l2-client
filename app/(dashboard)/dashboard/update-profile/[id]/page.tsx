"use client";

import FormSubmitLoading from "@/components/shared/FormSubmitLoading";
import ControlledInput from "@/components/shared/input/ControlledInput";
import { FileUploadController } from "@/components/shared/input/FileUploadController";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchData, usePatch } from "@/hooks/useApi";
import { TLoggedInUser } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  profileImg: z.any().optional(),
});

type TUpdateProfileForm = z.infer<typeof updateProfileSchema>;

export default function UpdateProfilePage() {
  const router = useRouter();

  const {
    data: userData,
    isLoading: userDataLoading,
    refetch: userDataRefetch,
  } = useFetchData<TLoggedInUser>(["loggedInUser"], "/user/logged-user");

  const user: TLoggedInUser | null = (userData as any)?.data ?? null;

  const { mutateAsync: updateMutate, isPending: updatePending } = usePatch([
    ["loggedInUser"],
  ]);

  const methods = useForm<TUpdateProfileForm>({
    resolver: zodResolver(updateProfileSchema),
    values: {
      name: user?.username ?? "",
      email: user?.email ?? "",
      profileImg: undefined,
    },
  });

  const handleUpdateProfile = async (data: TUpdateProfileForm) => {
    const toastId = toast.loading("Updating profile...");
    try {
      const payload = { username: data.name, email: data.email };
      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));
      if (data.profileImg) {
        formData.append("profileImg", data.profileImg);
      }

      const result: any = await updateMutate({
        url: "/auth/update-user",
        payload: formData,
      });

      if (result?.data) {
        toast.success(result.data.message, { id: toastId, duration: 1000 });
        userDataRefetch();
        setTimeout(() => router.push("/dashboard"), 700);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong", {
        id: toastId,
        duration: 1400,
      });
    }
  };

  return (
    <>
      {(userDataLoading || updatePending) && <FormSubmitLoading />}

      <div className="UpdateProfileContainer py-8 bg-gray-100 border border-gray-300 p-3 shadow rounded-md">
        <div className="UpdateProfileWrapper">
          <h1 className="mb-8 px-3 xsm:px-4 sm:px-5 md:px-6 font-bold text-2xl md:text-3xl text-center">
            Update Profile
          </h1>

          <div className="updateCarForm p-1 w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[70%] xmd:w-[65%] lg:w-[55%] m-auto">
            {userDataLoading ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20 bg-gray-300" />
                  <Skeleton className="h-10 w-full bg-gray-200 rounded" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20 bg-gray-300" />
                  <Skeleton className="h-10 w-full bg-gray-200 rounded" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 bg-gray-300" />
                  <Skeleton className="h-10 w-full bg-gray-200 rounded" />
                </div>
                <Skeleton className="h-12 w-full bg-prime50 rounded" />
              </div>
            ) : (
              <FormProvider {...methods}>
                <form
                  onSubmit={methods.handleSubmit(handleUpdateProfile)}
                  className="space-y-5"
                >
                  <ControlledInput
                    name="name"
                    label="Name :"
                    placeholder="Enter Your Name"
                  />
                  <ControlledInput
                    name="email"
                    type="email"
                    label="Email :"
                    placeholder="Enter Your Email"
                  />
                  <FileUploadController
                    name="profileImg"
                    label="Profile Image :"
                  />
                  <Button
                    type="submit"
                    disabled={updatePending}
                    className="w-full font-semibold text-sm active:scale-95 duration-500 bg-prime50 hover:bg-prime100"
                  >
                    Update Profile
                  </Button>
                </form>
              </FormProvider>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
