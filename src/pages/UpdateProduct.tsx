import { useGetSingleProductsQuery } from "@/redux/features/product/product.api";
import {
  ReimentForm,
  ReimentInput,
  ReimentSelect,
  ReimentTextArea,
} from "@/components/form";
import {
  FormSubmitLoading,
  TableDataError,
  TableDataLoading,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useGetAllCategoryQuery } from "@/redux/features/category/category.api";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: categoryData, isLoading: categoryDataLoading } =
    useGetAllCategoryQuery(undefined);

  const {
    data: productData,
    isLoading: productDataLoading,
    isError: productDataError,
  } = useGetSingleProductsQuery(id as string, { skip: !id });

  // const [updateProduct, { isLoading: productUpdationLoading }] =
  // useUpdateProductMutation();

  const categoryOptions = categoryData?.data?.map((category: any) => ({
    name: category.name,
    value: category.id,
  }));

  let defaultValues;

  defaultValues = {
    name: productData?.data?.name,
    categoryId: productData?.data?.categoryId,
    price: productData?.data?.price,
    description: productData?.data?.description,
    inventoryCount: productData?.data?.inventoryCount,
  };

  // ! for updating product
  const handleUpdateProduct = async (data: FieldValues) => {
    console.log(data);
  };

  // ! effect for storing default value
  useEffect(() => {
    if (productData?.data) {
      defaultValues = {
        name: productData?.data?.name,
        categoryId: productData?.data?.categoryId,
        price: productData?.data?.price,
        description: productData?.data?.description,
        inventoryCount: productData?.data?.inventoryCount,
      };
    }
  }, [productData]);

  let content = null;

  if (productDataLoading || categoryDataLoading) {
    content = (
      <tr>
        <td colSpan={8} className="p-4">
          <TableDataLoading />
        </td>
      </tr>
    );
  } else if (
    (!productDataLoading || !productDataError) &&
    productData?.data &&
    categoryData
  ) {
    content = (
      <ReimentForm defaultValues={defaultValues} onSubmit={handleUpdateProduct}>
        <ReimentInput
          type="text"
          label="Product Name :"
          name="name"
          placeholder="Enter Product Name"
        />

        <ReimentSelect
          label="Category :"
          name="categoryId"
          options={categoryOptions}
        />

        <ReimentInput
          type="number"
          label="Price :"
          name="price"
          placeholder="Enter Product Price"
        />

        <ReimentTextArea
          label="Description :"
          name="description"
          placeholder="Enter Product Description"
        />

        <ReimentInput
          type="number"
          label="Inventory Count :"
          name="inventoryCount"
          placeholder="Enter Inventory Count"
        />

        <Button
          className={`px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base active:scale-95 duration-500 bg-prime50 hover:bg-prime100`}
        >
          Update Product
        </Button>
      </ReimentForm>
    );
  }

  return (
    <>
      <>
        {productDataLoading && <FormSubmitLoading />}

        <div className="AddCategoryContainer py-8 bg-gray-100 min-h-screen p-3 shadow rounded-md">
          <div className="AddCategoryWrapper">
            <h1 className="mb-8 px-3 xsm:px-4 sm:px-5 md:px-6 font-bold text-2xl md:text-3xl text-center">
              Update Product
            </h1>

            <div className="addCategoryForm p-1 w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[70%] xmd:w-[65%] lg:w-[55%] m-auto">
              {content}
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default UpdateProduct;
