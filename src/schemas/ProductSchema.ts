import z from "zod";

// Zod validation schema for Add Product form
export const addProductSchema = z.object({
  name: z.string().min(1, { message: "Product name is required" }),
  categoryId: z.string().min(1, { message: "Category is required" }),
  price: z.string().min(1, { message: "Product Price is required" }),
  productImg: z
    .any()
    .refine((file) => file instanceof File || Array.isArray(file), {
      message: "Product image is required",
    }),
  description: z.string().min(1, { message: "Description is required" }),
  inventoryCount: z
    .string()
    .min(1, { message: "Product Inventory count is required" }),
});
