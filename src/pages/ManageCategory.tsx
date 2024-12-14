import {
  CategotyDeleteModal,
  FormSubmitLoading,
  TableDataError,
  TableDataLoading,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import {
  useDeleteCategoryMutation,
  useGetAllCategoryQuery,
} from "@/redux/features/category/category.api";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type TCategory = {
  id: string;
  name: string;
  categoryImg?: string;
};

const ManageCategory = () => {
  const {
    data: categoryData,
    isLoading: categoryDataLoading,
    isError: categoryDataError,
    refetch: categoryDataRefetch,
  } = useGetAllCategoryQuery(undefined);

  const [deleteCategory, { isLoading: categoryDeleteLoaging }] =
    useDeleteCategoryMutation();

  // console.log(categoryData?.data);

  // ! for deleting a category
  const handleDeleteCategory = async (id: string) => {
    try {
      const taostId = toast.loading("Deleting Category....");

      const result = await deleteCategory(id);

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
        categoryDataRefetch();
        const successMsg = result?.data?.message;
        toast.success(successMsg, {
          id: taostId,
          duration: 1000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while Deleting Category !!!", {
        duration: 1400,
      });
    }
  };

  let content = null;

  // *  if data is loading
  if (categoryDataLoading) {
    content = (
      <tr>
        <td colSpan={8} className="p-4">
          <TableDataLoading />
        </td>
      </tr>
    );
  }

  // *  if any error
  if (!categoryDataLoading && categoryDataError) {
    content = (
      <tr>
        <td colSpan={8}>
          <TableDataError message="Something went wrong " />
        </td>
      </tr>
    );
  }

  // * for no data
  if (
    !categoryDataLoading &&
    !categoryDataError &&
    categoryData?.data?.length < 1
  ) {
    content = (
      <tr>
        <td colSpan={8}>
          <TableDataError message="Nothing Found" />
        </td>
      </tr>
    );
  }

  // * for user data
  if (
    !categoryDataLoading &&
    !categoryDataError &&
    categoryData?.data?.length
  ) {
    content = categoryData?.data?.map((category: TCategory) => (
      <tr key={category?.id} className="border-b">
        <td className="p-4 text-center">{category?.name}</td>
        <td className="p-4 text-center">
          <div className="imgCOntainer flex justify-center items-center ">
            <img
              src={category?.categoryImg}
              className=" size-[4.6rem] rounded-md overflow-auto "
              alt=""
            />
          </div>
        </td>

        <td className="p-4 text-center">
          <Link
            to={`/dashboard/admin/categories/update-category/${category?.id}`}
          >
            <Button className=" px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base bg-prime100 hover:bg-prime100 active:scale-95 duration-500 ">
              Update
            </Button>
          </Link>{" "}
        </td>

        <td className="p-4 text-center">
          <CategotyDeleteModal
            handleDeleteFunction={handleDeleteCategory}
            id={category?.id}
          />
        </td>
      </tr>
    ));
  }

  return (
    <>
      {categoryDeleteLoaging && <FormSubmitLoading />}

      <div className="ManageCategoryContainer">
        <div className="ManageCategoryWrapper bg-gray-100 border border-gray-300 shadow rounded-md p-3  ">
          <h3 className="brand text-2xl font-medium mb-6 ">Manage Category</h3>

          {/* new category add  container starts  */}
          <div className="addNewProduct mb-6 ">
            <Link to={"/dashboard/admin/categories/add-category"}>
              <Button className=" px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base bg-prime50 hover:bg-prime100 active:scale-95 duration-500 ">
                Add new Category
              </Button>
            </Link>

            {/*  */}
          </div>
          {/* new category add  container ends */}

          {/*manage category table starts  */}
          <div className="manageUserTable relative w-full overflow-auto mt-4 ">
            <table className="w-full text-sm ">
              <thead className="border-b">
                <tr className="w-full text-sm bg-sky-100  ">
                  <th className="px-4 font-medium">Category Name</th>
                  <th className="px-4 font-medium">Category Image</th>
                  <th className="px-4 font-medium">Update Category </th>
                  <th className="px-4 font-medium">Delete Category </th>
                </tr>
              </thead>
              <tbody>{content}</tbody>
            </table>
          </div>
          {/* manage category table ends  */}

          {/*  */}
        </div>
      </div>
    </>
  );
};

export default ManageCategory;
