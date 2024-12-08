import z from "zod";

//! Zod validation schema for Add Product form
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
//! Zod validation schema for update Product form
export const updateProductSchema = z.object({
  name: z.string().min(1, { message: "Product name is required" }).optional(),
  categoryId: z.string().min(1, { message: "Category is required" }).optional(),
  price: z.string().min(1, { message: "Product Price is required" }).optional(),
  productImg: z
    .any()
    .refine((file) => file instanceof File || Array.isArray(file), {
      message: "Product image is required",
    })
    .optional(),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .optional(),
  inventoryCount: z
    .string()
    .min(1, { message: "Product Inventory count is required" })
    .optional(),
});
