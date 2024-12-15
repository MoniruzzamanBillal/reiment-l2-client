import { ReimentForm, ReimentInput } from "@/components/form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddCategoryMutation } from "@/redux/features/category/category.api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { FormSubmitLoading } from "@/components/ui";

const AddCategory = () => {
  const navigate = useNavigate();
  const [addCategory, { isLoading }] = useAddCategoryMutation();

  // console.log(isLoading);

  const handleAddCategory = async (data: FieldValues) => {
    const { name, categoryImg } = data;

    // console.log(categoryImg);

    const formData = new FormData();

    const payload = {
      name,
    };

    formData.append("data", JSON.stringify(payload));
    formData.append("categoryImg", categoryImg);

    const result = await addCategory(formData);

    //  *  for any  error
    if (result?.error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMessage = (result?.error as any)?.data?.message;
      console.log(errorMessage);
      toast.error(errorMessage, {
        duration: 1400,
      });
    }

    if (result?.data?.success) {
      toast.success(result?.data?.message, { duration: 1200 });

      setTimeout(() => {
        navigate("/dashboard/admin/categories");
      }, 600);
    }
  };

  return (
    <>
      {isLoading && <FormSubmitLoading />}

      <div className="AddCategoryContainer py-8 bg-gray-100 border border-gray-200  p-3 shadow rounded-md">
        <div className="AddCategoryWrapper">
          <h1 className="mb-8 px-3 xsm:px-4 sm:px-5 md:px-6 font-bold text-2xl md:text-3xl text-center">
            Add Category
          </h1>

          {/* add category form container starts */}
          <div className="addCategoryForm p-1 w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[70%] xmd:w-[65%] lg:w-[55%] m-auto">
            {/* form starts */}
            <ReimentForm
              onSubmit={handleAddCategory}
              resolver={zodResolver(
                z.object({
                  name: z.string().min(1, "Category name is required !!!"),
                  categoryImg: z
                    .any()
                    .refine((file) => file instanceof File && file?.size > 0, {
                      message: "Category image is required !!",
                    }),
                })
              )}
            >
              <ReimentInput
                type="text"
                label="Category Name :"
                name="name"
                placeholder="Enter Category Name"
              />
              <ReimentInput
                type="file"
                label="Categoty Image : "
                name="categoryImg"
              />

              <Button
                className={`px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base active:scale-95 duration-500 bg-prime50 hover:bg-prime100`}
              >
                Add Category
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

export default AddCategory;
