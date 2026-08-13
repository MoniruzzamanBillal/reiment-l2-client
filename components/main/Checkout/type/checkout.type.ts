import { z } from "zod";
import { checkoutSchema } from "../schema/checkout.schema";

export type TCheckoutForm = z.infer<typeof checkoutSchema>;
