import {
  ReimentForm,
  ReimentInput,
  ReimentSelect,
  ReimentTextArea,
} from "@/components/form";
import { FormSubmitLoading } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useGetAllCategoryQuery } from "@/redux/features/category/category.api";
import { addProductSchema } from "@/schemas/ProductSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";

type TCategory = {
  id: string;
  name: string;
};

const AddProduct = () => {
  //   let categoryOptions = [];

  const [categoryOptions, setCategoryOptions] = useState([]);
  const {
    data: categoryData,
    isLoading: categoryDataLoading,
    error: categoryDataError,
  } = useGetAllCategoryQuery(undefined);

  //   console.log(categoryData?.data);

  // ! for adding product
  const handleAddProduct = async (data: FieldValues) => {
    console.log(data);
  };

  //   ! effect for get category data
  useEffect(() => {
    if (categoryData?.data) {
      const modifiedData = categoryData?.data?.map((item: TCategory) => {
        const optionValue = {
          name: item?.name,
          value: item?.id,
        };

        return optionValue;
      });

      setCategoryOptions(modifiedData);
    }
  }, [categoryData?.data, categoryDataLoading]);

  //   console.log(categoryOptions);

  return (
    <>
      {categoryDataLoading && <FormSubmitLoading />}

      <div className="AddCategoryContainer py-8 bg-gray-100 border border-gray-300 p-3 shadow rounded-md">
        <div className="AddCategoryWrapper">
          <h1 className="mb-8 px-3 xsm:px-4 sm:px-5 md:px-6 font-bold text-2xl md:text-3xl text-center">
            Add Product
          </h1>

          {/* add category form container starts */}
          <div className="addCategoryForm p-1 w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[70%] xmd:w-[65%] lg:w-[55%] m-auto">
            {/* form starts */}
            <ReimentForm
              onSubmit={handleAddProduct}
              resolver={zodResolver(addProductSchema)}
            >
              {/* Product Name */}
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

              {/* Product Price */}
              <ReimentInput
                type="number"
                label="Price :"
                name="price"
                placeholder="Enter Product Price"
              />

              {/* Product Image */}
              <ReimentInput
                type="file"
                label="Product Image :"
                name="productImg"
              />

              {/* Product Description */}
              <ReimentTextArea
                label="Description :"
                name="description"
                placeholder="Enter Product Description"
              />

              {/* Inventory Count */}
              <ReimentInput
                type="number"
                label="Inventory Count :"
                name="inventoryCount"
                placeholder="Enter Inventory Count"
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

export default AddProduct;
