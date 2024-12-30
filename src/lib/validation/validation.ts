import { z } from "zod";

export const signInSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "it must be at least 8 password" }),
  });