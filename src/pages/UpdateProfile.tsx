import { ReimentForm, ReimentInput } from "@/components/form";
import { Skeleton } from "@/components/ui/skeleton";

import { FormSubmitLoading } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useGetLoggedInUserQuery } from "@/redux/features/user/user.api";
import { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { useParams } from "react-router-dom";

const UpdateProfile = () => {
  const { id } = useParams();

  const { data: userData, isLoading: userDataLoading } =
    useGetLoggedInUserQuery(undefined);

  console.log(id);
  console.log(userData?.data);

  let defaultValues;
  let content;

  defaultValues = {
    name: userData?.data?.username,
    email: userData?.data?.email,
    file: userData?.data?.profileImg,
  };

  const handleUpdateProfile = async (data: FieldValues) => {
    console.log(data);
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
      <ReimentForm
        onSubmit={handleUpdateProfile}
        defaultValues={defaultValues}
        //   resolver={zodResolver(updateProfileSchema)}
      >
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

        <ReimentInput type="file" label="Profile Image : " name="file" />

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
        file: userData?.data?.profileImg,
      };
    }
  }, [userData?.data]);

  console.log(defaultValues);

  return (
    <>
      {userDataLoading && <FormSubmitLoading />}

      <div className="UpdateProfileContainer  py-8 bg-gray-100   p-3 shadow rounded-md ">
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
