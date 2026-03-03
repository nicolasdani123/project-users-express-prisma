import z from "zod";
import { idUserSchema, nameSchema, emailSchema, roleSchema, isActiveSchema, dateSchema } from "./user.fields.schema.js";

// --- Response schemas ---

export const responseUserSchema = z.object({
  id: idUserSchema,
  name: nameSchema,
  email: emailSchema,
  role: roleSchema,
  is_active: isActiveSchema,
  created_at: dateSchema,
  updated_at: dateSchema,
});

// --- Types ---

export type ResponseUserOutput = z.infer<typeof responseUserSchema>;
