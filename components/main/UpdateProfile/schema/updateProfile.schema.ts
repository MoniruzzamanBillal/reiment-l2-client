import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  profileImg: z.any().optional(),
});

export type TUpdateProfileForm = z.infer<typeof updateProfileSchema>;
