import { ReimentForm, ReimentInput } from "@/components/form";
import { Skeleton } from "@/components/ui/skeleton";

import { FormSubmitLoading } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useGetLoggedInUserQuery } from "@/redux/features/user/user.api";
import { useEffect } from "react";
import { FieldValues } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdateUserMutation } from "@/redux/features/auth/auth.api";
import { toast } from "sonner";

const UpdateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: userData,
    isLoading: userDataLoading,
    refetch: userDataRefetch,
  } = useGetLoggedInUserQuery(undefined);

  const [updateUser, { isLoading: updateUserLoading }] =
    useUpdateUserMutation();

  // console.log(id);
  // console.log(userData?.data);

  let defaultValues;
  let content;

  defaultValues = {
    name: userData?.data?.username,
    email: userData?.data?.email,
  };

  const handleUpdateProfile = async (data: FieldValues) => {
    try {
      const { name, email, profileImg } = data;

      const payload = { username: name, email };

      const formData = new FormData();

      formData.append("data", JSON.stringify(payload));

      if (profileImg) {
        formData.append("profileImg", profileImg);
      }

      const taostId = toast.loading("Updating profile....");
      const result = await updateUser(formData);

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
        userDataRefetch();
        setTimeout(() => {
          navigate("/dashboard");
        }, 700);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while updating profile!!!", {
        duration: 1400,
      });
    }
  };

  if (userDataLoading) {
    content = (
      <div className="space-y-6">
        {/* Name Input Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 bg-gray-300" />
          <Skeleton className="h-10 w-full bg-gray-200 rounded" />
        </div>

        {/* Email Input Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 bg-gray-300" />
          <Skeleton className="h-10 w-full bg-gray-200 rounded" />
        </div>

        {/* File Input Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 bg-gray-300" />
          <Skeleton className="h-10 w-full bg-gray-200 rounded" />
        </div>

        {/* Button Skeleton */}
        <Skeleton className="h-12 w-full bg-prime50 rounded" />
      </div>
    );
  } else {
    content = (
      <ReimentForm onSubmit={handleUpdateProfile} defaultValues={defaultValues}>
        <ReimentInput
          type="text"
          label="Name :"
          name="name"
          placeholder="Enter Your Name"
        />

        <ReimentInput
          type="email"
          label="Email :"
          name="email"
          placeholder="Enter Your Email"
        />

        <ReimentInput type="file" label="Profile Image : " name="profileImg" />

        <Button
          className={`px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base active:scale-95 duration-500 bg-prime50 hover:bg-prime100 `}
        >
          Update Profile
        </Button>
      </ReimentForm>
    );
  }

  useEffect(() => {
    if (userData?.data) {
      defaultValues = {
        name: userData?.data?.username,
        email: userData?.data?.email,
      };
    }
  }, [userData?.data]);

  return (
    <>
      {(userDataLoading || updateUserLoading) && <FormSubmitLoading />}

      <div className="UpdateProfileContainer  py-8 bg-gray-100 border border-gray-300   p-3 shadow rounded-md ">
        <div className="UpdateProfileWrapper">
          <h1 className=" mb-8 px-3 xsm:px-4 sm:px-5 md:px-6 font-bold text-2xl  md:text-3xl text-center  ">
            Update Profile
          </h1>

          {/* update car form container starts  */}
          <div className="updateCarForm p-1 w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[70%] xmd:w-[65%] lg:w-[55%] m-auto ">
            {/* {content} */}

            {/* form starts */}
            {content}
            {/* form ends */}
          </div>
          {/* update car form container ends  */}
        </div>
      </div>
    </>
  );
};

export default UpdateProfile;
