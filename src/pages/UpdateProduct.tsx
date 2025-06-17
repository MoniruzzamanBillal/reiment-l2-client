/* eslint-disable @typescript-eslint/no-explicit-any */

import { FormSubmitLoading, TableDataLoading } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useGetAllCategoryQuery } from "@/redux/features/category/category.api";
import {
  useGetSingleProductsQuery,
  useUpdateProductMutation,
} from "@/redux/features/product/product.api";
import { useEffect, useRef, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

type TProductPayload = {
  name?: string;
  categoryId?: string;
  price?: number;
  description?: string;
  inventoryCount?: number;
  shopId?: string;
  discount?: number;
};

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    [{ font: [] }],
    ["bold", "italic", "underline", "strike"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
  ],
};

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

  const [updateProduct, { isLoading: productUpdationLoading }] =
    useUpdateProductMutation();

  const categoryOptions = categoryData?.data?.map((category: any) => ({
    label: category.name,
    value: category.id,
  }));

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // ! for changing the image preview url
  const changeImagePreviewUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e?.target?.files?.[0];
    if (imageFile) {
      const previewUrl = URL.createObjectURL(imageFile);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  // ! for removing a image after select image
  const handleRemoveImage = () => {
    setImagePreview(null);
    if (imageInputRef?.current) {
      imageInputRef.current.value = "";
    }
  };

  // ! for updating product
  const handleUpdateProduct = async (data: FieldValues) => {
    const { name, categoryId, price, productImg, description, inventoryCount } =
      data;

    const imageFile = productImg?.[0];

    const payload: TProductPayload = {
      name,
      categoryId,
      price: parseFloat(price),
      description,
      inventoryCount: parseFloat(inventoryCount),
    };

    if (parseFloat(data?.price) <= parseFloat(data?.discount)) {
      toast.error("Discount amount cann't exceed product price !!!");
      return;
    }

    if (data?.discount) {
      payload.discount = parseFloat(data?.discount);
    }

    const formData = new FormData();

    formData.append("data", JSON.stringify(payload));

    if (productImg) {
      formData.append("prodImg", imageFile);
    }

    try {
      const taostId = toast.loading("Updating Product....", { duration: 1000 });

      const result = await updateProduct({ formData, id });

      //  *  for any  error
      if (result?.error) {
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

        setTimeout(() => {
          navigate("/dashboard/vendor/manage-products");
        }, 700);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while updating product !!!", {
        duration: 1400,
      });
    }
  };

  // console.log(productData?.data?.productImg);

  // ! effect for storing default value
  useEffect(() => {
    if (productData?.data) {
      const product = productData?.data;

      reset({
        name: product?.name,
        category: product?.categoryId,
        price: product?.price,
        description: product?.description,
        inventoryCount: product?.inventoryCount,
        discount: product?.discount,
      });

      if (product?.productImg) {
        setImagePreview(product.productImg);
      }
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
      <form
        onSubmit={handleSubmit(handleUpdateProduct)}
        className=" flex flex-col gap-y-4 "
      >
        {/* Product Name */}
        <div className="productnameContainer flex flex-col gap-y-1.5">
          <Label htmlFor="name">Product Name : </Label>
          <Input
            id="name"
            type="text"
            className="  "
            placeholder="Enter Product Name "
            {...register("name", {
              required: "Product Name is required !!!",
            })}
          />
          {errors?.name && (
            <span className="text-red-600 text-sm">
              {errors?.name?.message as string}
            </span>
          )}
        </div>

        {/* category input  */}

        <div className="categoryContainer flex flex-col gap-y-1.5">
          <Label htmlFor="category">Product Category</Label>
          <Controller
            name="category"
            control={control}
            rules={{ required: "Course Category is required !!!" }}
            render={({ field }) => (
              <Select
                {...field}
                options={categoryOptions}
                value={categoryOptions?.find(
                  (option: { label: string; value: string }) =>
                    option?.value === field?.value
                )}
                onChange={(selectedOption) =>
                  field.onChange(selectedOption?.value)
                }
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Select Categories..."
              />
            )}
          />
          {errors?.category && (
            <span className="text-red-600 text-sm">
              {errors?.category?.message as string}
            </span>
          )}
        </div>

        {/* image field  */}
        <div className="imageContainer flex flex-col gap-y-1">
          <Label htmlFor="productImg">Product Image </Label>
          <Input
            id="productImg"
            type="file"
            {...register("productImg")}
            ref={(e) => {
              register("productImg").ref(e);
              imageInputRef.current = e;
            }}
            onChange={(e) => changeImagePreviewUrl(e)}
          />

          {imagePreview && (
            <div className="relative mt-2 w-fit">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md border"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              >
                <X />
              </button>
            </div>
          )}
        </div>

        {/* description field  */}
        <div className="descriptionContainer flex flex-col gap-y-1.5 h-[22rem]  ">
          <Label htmlFor="description">Product Detail </Label>

          <Controller
            name="description"
            control={control}
            defaultValue=""
            rules={{ required: "Product Detail is required" }}
            render={({ field }) => (
              <ReactQuill
                theme="snow"
                value={field.value}
                onChange={field.onChange}
                className="h-full w-full font-medium bg-white "
                modules={modules}
              />
            )}
          />

          {errors?.description && (
            <span className="text-red-600 text-sm">
              {errors?.description?.message as string}
            </span>
          )}
        </div>

        {/* price  */}
        <div className="priceContainer flex flex-col gap-y-1.5 mt-[3rem] ">
          <Label htmlFor="price">Product Price</Label>
          <Input
            id="price"
            type="number"
            className="  "
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
            placeholder="Enter Product Price "
            {...register("price", {
              valueAsNumber: true,
              required: "Product Price is required !!!",
            })}
          />
          {errors?.price && (
            <span className="text-red-600 text-sm">
              {errors?.price?.message as string}
            </span>
          )}
        </div>

        {/* discount price  */}
        <div className="discountpriceContainer flex flex-col gap-y-1.5  ">
          <Label htmlFor="discount">Product Discount Price(optional)</Label>
          <Input
            id="discount"
            type="number"
            className="  "
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
            placeholder="Enter Product Discount Price "
            {...register("discount", {
              valueAsNumber: true,
            })}
          />
          {errors?.discount && (
            <span className="text-red-600 text-sm">
              {errors?.discount?.message as string}
            </span>
          )}
        </div>

        {/* inventory count    */}
        <div className="inventoryContainer flex flex-col gap-y-1.5 ">
          <Label htmlFor="inventoryCount">Invenroty : </Label>
          <Input
            id="inventoryCount"
            type="number"
            className="  "
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
            placeholder="Enter Product Discount Price "
            {...register("inventoryCount", {
              valueAsNumber: true,
              required: "Product Inventory is required !!!",
            })}
          />
          {errors?.inventoryCount && (
            <span className="text-red-600 text-sm">
              {errors?.inventoryCount?.message as string}
            </span>
          )}
        </div>

        <Button
          disabled={isSubmitting}
          className={`px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base  active:scale-95 duration-500  bg-prime50 hover:bg-prime100 ${
            isSubmitting
              ? " cursor-not-allowed bg-gray-600 "
              : "bg-prime50 hover:bg-prime100  "
          }   `}
        >
          {isSubmitting ? "Updating New Product..." : "Update Product "}
        </Button>

        {/*  */}
      </form>
    );
  }

  return (
    <>
      <>
        {(productUpdationLoading || productDataLoading) && (
          <FormSubmitLoading />
        )}

        <div className="AddCategoryContainer py-8 bg-gray-100 border border-gray-200 p-3 shadow rounded-md">
          <div className="AddCategoryWrapper">
            <h1 className="mb-8 px-3 xsm:px-4 sm:px-5 md:px-6 font-bold text-2xl md:text-3xl text-center">
              Update Product
            </h1>

            <div className="updateCategoryForm p-1 w-[95%] xsm:w-[85%]  m-auto">
              {content}
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default UpdateProduct;
