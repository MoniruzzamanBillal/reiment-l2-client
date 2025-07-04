import { FormSubmitLoading } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useGetAllCategoryQuery } from "@/redux/features/category/category.api";
import { useAddProductMutation } from "@/redux/features/product/product.api";
import { useGetVendorShopQuery } from "@/redux/features/shop/shop.api";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "sonner";

type TCategory = {
  id: string;
  name: string;
};

type TProductPayload = {
  name: string;
  categoryId: string;
  price: number;
  description: string;
  inventoryCount: number;
  shopId: string;
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

type TCategoryOption = {
  label: string;
  value: string;
};

const AddProduct = () => {
  const navigate = useNavigate();

  const [categoryOptions, setCategoryOptions] = useState<TCategoryOption[]>([]);
  const { data: categoryData, isLoading: categoryDataLoading } =
    useGetAllCategoryQuery(undefined);

  const { data: shopData } = useGetVendorShopQuery(undefined);

  const [addProduct, { isLoading: productCreationLoading }] =
    useAddProductMutation();

  //   console.log(categoryData?.data);

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm();
  // { resolver: zodResolver(addProductSchema) }

  // console.log(categoryOptions);

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

  // ! for adding product
  const handleAddProduct = async (data: FieldValues) => {
    const { name, category, price, description, inventoryCount } = data;

    console.log(data);

    const imageFile = data?.productImg?.[0];

    const payload: TProductPayload = {
      name,
      categoryId: category,
      price: parseFloat(price),
      description,
      inventoryCount: parseFloat(inventoryCount),
      shopId: shopData?.data?.id,
    };

    // console.log(payload);

    if (data?.discount) {
      payload.discount = parseFloat(data?.discount);
    }

    const formData = new FormData();

    formData.append("data", JSON.stringify(payload));
    formData.append("prodImg", imageFile);

    try {
      const taostId = toast.loading("Creating Product....");

      const result = await addProduct(formData);

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
      toast.error("Something went wrong while crating product !!!", {
        duration: 1400,
      });
    }
  };

  //   ! effect for get category data
  useEffect(() => {
    if (categoryData?.data) {
      const modifiedData = categoryData?.data?.map((item: TCategory) => {
        const optionValue = {
          label: item?.name,
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
      {(productCreationLoading || categoryDataLoading) && <FormSubmitLoading />}

      <div className="AddCategoryContainer py-8 bg-gray-100 border border-gray-300 p-3 shadow rounded-md">
        <div className="AddCategoryWrapper">
          <h1 className="mb-8 px-3 xsm:px-4 sm:px-5 md:px-6 font-bold text-2xl md:text-3xl text-center">
            Add Product
          </h1>

          {/*  form container starts */}
          <div className="addCategoryForm p-1 w-[95%] xsm:w-[85%]  m-auto">
            {/* form starts */}
            <form
              onSubmit={handleSubmit(handleAddProduct)}
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
                          option === field?.value
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
                <Label htmlFor="discount">
                  Product Discount Price(optional)
                </Label>
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
                {isSubmitting ? "Adding New Product" : "Add Product "}
              </Button>

              {/*  */}
            </form>
            {/* form ends */}
          </div>
          {/* add category form container ends */}
        </div>
      </div>
    </>
  );
};

export default AddProduct;
