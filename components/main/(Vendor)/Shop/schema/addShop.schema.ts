import { z } from "zod";

export const addShopSchema = z.object({
  name: z.string().min(1, "Shop name is required"),
  description: z.string().min(1, "Description is required"),
  logo: z.any().refine((f) => f instanceof File && f.size > 0, {
    message: "Shop logo is required",
  }),
});

export type TAddShopForm = z.infer<typeof addShopSchema>;
