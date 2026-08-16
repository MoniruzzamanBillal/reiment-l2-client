import { z } from "zod";

export const addCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  categoryImg: z.any().refine((f) => f instanceof File && f.size > 0, { message: "Category image is required" }),
});

export type TAddCategoryForm = z.infer<typeof addCategorySchema>;
