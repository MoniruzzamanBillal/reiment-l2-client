import { ReimentForm, ReimentInput } from "@/components/form";
import { FormSubmitLoading, TableDataLoading } from "@/components/ui";
import { Button } from "@/components/ui/button";
import {
  useGetSingleCategoryQuery,
  useUpdateCategoryMutation,
} from "@/redux/features/category/category.api";
import { useEffect } from "react";

import { FieldValues } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const UpdateCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  if (!id) {
    throw new Error("Something went wrong!! ");
  }

  const {
    data: categoryDetail,
    isLoading: categoryDetailLoading,
    isFetching: categoryDetailFetching,
  } = useGetSingleCategoryQuery(id, { skip: !id });

  const [updateCategory, { isLoading: categoryUpdationLoading }] =
    useUpdateCategoryMutation();

  //   console.log(categoryDetail?.data);

  let defaultValues;

  defaultValues = {
    name: categoryDetail?.data?.name,
  };

  //   ! for updating category
  const handleUpdateCategory = async (data: FieldValues) => {
    const result = await updateCategory({ id, data });

    //  *  for any  error
    if (result?.error) {
      console.log(result?.error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMessage = (result?.error as any)?.data?.message;
      toast.error(errorMessage, {
        duration: 1500,
      });
    }

    // * for successful updation
    if (result?.data) {
      const successMsg = result?.data?.message;
      toast.success(successMsg, {
        duration: 1000,
      });

      setTimeout(() => {
        navigate("/dashboard/admin/categories");
      }, 600);
    }
  };

  // ! effect for getting default value

  useEffect(() => {
    if (categoryDetail?.data) {
      defaultValues = {
        name: categoryDetail?.data?.name,
      };
    }
  }, [categoryDetail]);

  let content = null;

  // *  if data is loading
  if (categoryDetailLoading || categoryDetailFetching) {
    content = (
      <tr>
        <td colSpan={8} className="p-4">
          <TableDataLoading />
        </td>
      </tr>
    );
  } else if (
    (!categoryDetailLoading || !categoryDetailFetching) &&
    categoryDetail?.data
  ) {
    content = (
      <ReimentForm
        defaultValues={defaultValues}
        onSubmit={handleUpdateCategory}
      >
        <ReimentInput
          type="text"
          label="Category Name :"
          name="name"
          placeholder="Enter Category Name"
        />

        <Button
          className={`px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base active:scale-95 duration-500 bg-prime50 hover:bg-prime100`}
        >
          Update Category
        </Button>
      </ReimentForm>
    );
  }

  return (
    <>
      {(categoryDetailLoading || categoryUpdationLoading) && (
        <FormSubmitLoading />
      )}

      <div className="AddCategoryContainer py-8 bg-gray-100 min-h-screen p-3 shadow rounded-md">
        <div className="AddCategoryWrapper">
          <h1 className="mb-8 px-3 xsm:px-4 sm:px-5 md:px-6 font-bold text-2xl md:text-3xl text-center">
            Update Category
          </h1>

          {/* add category form container starts */}
          <div className="addCategoryForm p-1 w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[70%] xmd:w-[65%] lg:w-[55%] m-auto">
            {/* form starts */}
            {content}
            {/* form ends */}
          </div>
          {/* add category form container ends */}
        </div>
      </div>
    </>
  );
};

export default UpdateCategory;
