import z from "zod";
import { idUserSchema, nameSchema, emailSchema, passwordSchema } from "./user.fields.schema.js";

// --- Create schemas ---

export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

// --- Types ---

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type IdUserInput = z.infer<typeof idUserSchema>;
