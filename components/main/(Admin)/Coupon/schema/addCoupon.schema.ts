import { z } from "zod";

export const addCouponSchema = z
  .object({
    code: z.string().min(1, "Coupon code is required"),
    discountValue: z.string().min(1, "Discount value is required"),
    usageLimit: z.string().min(1, "Usage limit is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export type TAddCouponForm = z.infer<typeof addCouponSchema>;
