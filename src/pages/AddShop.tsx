import { ReimentForm, ReimentInput } from "@/components/form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { FormSubmitLoading } from "@/components/ui";
import { useAddShopMutation } from "@/redux/features/shop/shop.api";

const AddShop = () => {
  const navigate = useNavigate();
  const [addShop, { isLoading: shopCreationLoading }] = useAddShopMutation();

  // ! for creating a shop
  const handleAddShop = async (data: FieldValues) => {
    console.log(data);

    const { name, description, logo } = data;

    const payload = {
      name,
      description,
    };

    const formData = new FormData();

    formData.append("data", JSON.stringify(payload));
    formData.append("logo", logo);

    const taostId = toast.loading("Creating Shop....");

    try {
      const result = await addShop(formData);

      // console.log(result);

      //  *  for any  error
      if (result?.error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessage = (result?.error as any)?.data?.message;

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

        setTimeout(() => {
          navigate("/dashboard/vendor/manage-shop");
        }, 600);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong !!!", { id: taostId, duration: 1400 });
    }
  };

  return (
    <>
      {shopCreationLoading && <FormSubmitLoading />}

      <div className="AddCategoryContainer py-8 bg-gray-100 border border-gray-300 p-3 shadow rounded-md">
        <div className="AddCategoryWrapper">
          <h1 className="mb-8 px-3 xsm:px-4 sm:px-5 md:px-6 font-bold text-2xl md:text-3xl text-center">
            Add Shop
          </h1>

          {/* add category form container starts */}
          <div className="addCategoryForm p-1 w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[70%] xmd:w-[65%] lg:w-[55%] m-auto">
            {/* form starts */}
            <ReimentForm
              onSubmit={handleAddShop}
              resolver={zodResolver(
                z.object({
                  name: z.string().min(1, "Shop name is required !!!"),
                  description: z.string().min(1, "description is required !!!"),
                  logo: z
                    .any()
                    .refine((file) => file instanceof File && file?.size > 0, {
                      message: "Shop Logo is required !!",
                    }),
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
                Add Shop
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

export default AddShop;
