import { ReimentForm, ReimentInput } from "@/components/form";

import { FormSubmitLoading } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { FieldValues } from "react-hook-form";
import { useParams } from "react-router-dom";

const UpdateProfile = () => {
  const { id } = useParams();

  console.log(id);

  const content = null;

  const handleUpdateProfile = async (data: FieldValues) => {
    console.log(data);
  };

  return (
    <>
      {/* {isLoading && <FormSubmitLoading />} */}

      <div className="UpdateProfileContainer  py-8 bg-gray-100  min-h-screen p-3 shadow rounded-md ">
        <div className="UpdateProfileWrapper">
          <h1 className=" mb-8 px-3 xsm:px-4 sm:px-5 md:px-6 font-bold text-2xl  md:text-3xl text-center  ">
            Update Profile
          </h1>

          {/* update car form container starts  */}
          <div className="updateCarForm p-1 w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[70%] xmd:w-[65%] lg:w-[55%] m-auto ">
            {/* {content} */}

            {/* form starts */}
            <ReimentForm
              onSubmit={handleUpdateProfile}
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

              <ReimentInput
                type="password"
                label="New Password :"
                name="password"
                placeholder="Enter New Password (Optional)"
              />
              <ReimentInput type="file" label="Profile Image : " name="file" />

              <Button
                className={`px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base active:scale-95 duration-500 bg-prime50 hover:bg-prime100 `}
              >
                Update Profile
              </Button>
            </ReimentForm>
            {/* form ends */}
          </div>
          {/* update car form container ends  */}
        </div>
      </div>
    </>
  );
};

export default UpdateProfile;
