"use client";

import FormSubmitLoading from "@/components/shared/FormSubmitLoading";
import ControlledTextEditor from "@/components/shared/input/ControlledTipTapTextEditor/ControlledTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFetchData, usePost } from "@/hooks/useApi";
import { useGenerateDescription } from "@/hooks/useAi";
import { TAiGenerateDescriptionResponse, TCategory, TVendorShop } from "@/types";
import { Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "sonner";

type TCategoryOption = { label: string; value: string };

export default function AddProductPage() {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<TCategoryOption[]>([]);

  const { data: shopData } = useFetchData<TVendorShop>(["vendorShop"], "/shop/vendor-shop");
  const shop: TVendorShop | null = (shopData as any)?.data ?? null;

  const { data: categoryData, isLoading: categoryLoading } = useFetchData<TCategory[]>(["allCategory"], "/category/all-category");

  const { mutateAsync: addProductMutate, isPending } = usePost([["vendorProducts", shop?.id ?? ""]]);
  const { mutateAsync: generateDescriptionMutate, isPending: isGenerating } = useGenerateDescription();

  const methods = useForm();
  const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting } } = methods;

  useEffect(() => {
    const cats: TCategory[] = (categoryData as any)?.data ?? [];
    setCategoryOptions(cats.map((c) => ({ label: c.name, value: c.id })));
  }, [categoryData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
    else setImagePreview(null);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleGenerateWithAi = async () => {
    const name = watch("name");
    const categoryId = watch("category");
    if (!name || !categoryId) {
      toast.error("Enter a product name and pick a category first");
      return;
    }
    const toastId = toast.loading("Drafting with AI...");
    try {
      const result: any = await generateDescriptionMutate({
        url: "/ai/generate-description",
        payload: { name, categoryId, keywords: name },
      });
      const aiData: TAiGenerateDescriptionResponse = result?.data;
      setValue("name", aiData.title, { shouldDirty: true });
      setValue("description", aiData.description, { shouldValidate: true, shouldDirty: true });
      toast.success("Draft generated — feel free to edit before submitting", { id: toastId, duration: 1500 });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Couldn't generate a draft", { id: toastId, duration: 1400 });
    }
  };

  const onSubmit = async (data: any) => {
    const toastId = toast.loading("Creating Product...");
    try {
      const payload: any = {
        name: data.name,
        categoryId: data.category,
        price: parseFloat(data.price),
        description: data.description,
        inventoryCount: parseFloat(data.inventoryCount),
        shopId: shop?.id,
      };
      if (data.discount) payload.discount = parseFloat(data.discount);

      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));
      const imageFile = data.productImg?.[0];
      if (imageFile) formData.append("prodImg", imageFile);

      const result: any = await addProductMutate({ url: "/product/add-product", payload: formData });
      if (result?.data) {
        toast.success(result.data.message, { id: toastId, duration: 1000 });
        setTimeout(() => router.push("/dashboard/vendor/manage-products"), 700);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong", { id: toastId, duration: 1400 });
    }
  };

  return (
    <>
      {(isPending || categoryLoading) && <FormSubmitLoading />}

      <div className="AddCategoryContainer py-8 bg-gray-100 border border-gray-300 p-3 shadow rounded-md">
        <div className="AddCategoryWrapper">
          <h1 className="mb-8 px-3 font-bold text-2xl md:text-3xl text-center">Add Product</h1>

          <div className="p-1 w-[95%] xsm:w-[85%] m-auto">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isGenerating}
                    onClick={handleGenerateWithAi}
                    className="gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isGenerating ? "Generating..." : "Generate with AI"}
                  </Button>
                </div>

                <div className="flex flex-col gap-y-1.5">
                  <Label htmlFor="name">Product Name :</Label>
                  <Input id="name" type="text" placeholder="Enter Product Name" {...register("name", { required: "Product Name is required" })} />
                  {errors.name && <span className="text-red-600 text-sm">{errors.name.message as string}</span>}
                </div>

                <div className="flex flex-col gap-y-1.5">
                  <Label>Product Category</Label>
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Category is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={categoryOptions}
                        value={categoryOptions.find((o) => o.value === field.value) ?? null}
                        onChange={(opt) => field.onChange(opt?.value)}
                        placeholder="Select Category..."
                        className="react-select-container"
                        classNamePrefix="react-select"
                      />
                    )}
                  />
                  {errors.category && <span className="text-red-600 text-sm">{errors.category.message as string}</span>}
                </div>

                <div className="flex flex-col gap-y-1">
                  <Label htmlFor="productImg">Product Image</Label>
                  <Input
                    id="productImg"
                    type="file"
                    {...register("productImg")}
                    ref={(e) => { register("productImg").ref(e); imageInputRef.current = e; }}
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <div className="relative mt-2 w-fit">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-md border" />
                      <button type="button" onClick={handleRemoveImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">
                        <X />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-y-1.5 min-h-[22rem]">
                  <Label>Product Detail</Label>
                  <ControlledTextEditor name="description" />
                  {errors.description && <span className="text-red-600 text-sm">{errors.description.message as string}</span>}
                </div>

                <div className="flex flex-col gap-y-1.5 mt-8">
                  <Label htmlFor="price">Product Price</Label>
                  <Input id="price" type="number" onWheel={(e) => (e.target as HTMLInputElement).blur()} placeholder="Enter Product Price" {...register("price", { valueAsNumber: true, required: "Price is required" })} />
                  {errors.price && <span className="text-red-600 text-sm">{errors.price.message as string}</span>}
                </div>

                <div className="flex flex-col gap-y-1.5">
                  <Label htmlFor="discount">Product Discount Price (optional)</Label>
                  <Input id="discount" type="number" onWheel={(e) => (e.target as HTMLInputElement).blur()} placeholder="Enter Discount Price" {...register("discount", { valueAsNumber: true })} />
                </div>

                <div className="flex flex-col gap-y-1.5">
                  <Label htmlFor="inventoryCount">Inventory :</Label>
                  <Input id="inventoryCount" type="number" onWheel={(e) => (e.target as HTMLInputElement).blur()} placeholder="Enter Inventory Count" {...register("inventoryCount", { valueAsNumber: true, required: "Inventory is required" })} />
                  {errors.inventoryCount && <span className="text-red-600 text-sm">{errors.inventoryCount.message as string}</span>}
                </div>

                <Button type="submit" disabled={isSubmitting || isPending} className="font-semibold text-sm active:scale-95 duration-500 bg-prime50 hover:bg-prime100">
                  {isSubmitting || isPending ? "Adding Product..." : "Add Product"}
                </Button>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </>
  );
}
