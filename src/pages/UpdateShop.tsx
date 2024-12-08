import { ReimentForm, ReimentInput } from "@/components/form";
import { FormSubmitLoading } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { z } from "zod";
import { FieldValues } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const UpdateShop = () => {
  let defaultValues;

  const { id } = useParams();
  const navigate = useNavigate();
  if (!id) {
    throw new Error("Something went wrong!! ");
  }

  // ! for updating a shop
  const handleUpdateShop = async (data: FieldValues) => {
    console.log(data);
  };

  return (
    <>
      {/* {(categoryDetailLoading || categoryUpdationLoading) && (
        <FormSubmitLoading />
      )} */}

      <div className="AddCategoryContainer py-8 bg-gray-100 border border-gray-300 p-3 shadow rounded-md">
        <div className="AddCategoryWrapper">
          <h1 className="mb-8 px-3 xsm:px-4 sm:px-5 md:px-6 font-bold text-2xl md:text-3xl text-center">
            Update Shop
          </h1>

          {/* add category form container starts */}
          <div className="addCategoryForm p-1 w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[70%] xmd:w-[65%] lg:w-[55%] m-auto">
            {/* form starts */}
            <ReimentForm
              onSubmit={handleUpdateShop}
              resolver={zodResolver(
                z.object({
                  name: z
                    .string()
                    .min(1, "Shop name is required !!!")
                    .optional(),
                  description: z
                    .string()
                    .min(1, "description is required !!!")
                    .optional(),
                  logo: z
                    .any()
                    .refine((file) => file instanceof File && file?.size > 0, {
                      message: "Shop Logo is required !!",
                    })
                    .optional(),
                })
              )}
            >
              <ReimentInput
                type="text"
                label="Shop Name :"
                name="name"
                placeholder="Enter Shop Name"
              />
              <ReimentInput type="file" label="Shop Logo :" name="logo" />

              <ReimentInput
                type="text"
                label="Shop Description :"
                name="description"
                placeholder="Enter Shop Description"
              />

              <Button
                className={`px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base active:scale-95 duration-500 bg-prime50 hover:bg-prime100`}
              >
                Update Shop
              </Button>
            </ReimentForm>
            {/* form ends */}
          </div>
          {/* add category form container ends */}
        </div>
      </div>
    </>
  );
};

export default UpdateShop;
