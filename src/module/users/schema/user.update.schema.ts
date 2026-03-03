import z from "zod";
import { createUserSchema } from "./user.create.schema.js";
import { roleSchema } from "./user.fields.schema.js";

// --- Update schemas ---

export const updateUserSchema = createUserSchema.partial().refine(
  (data) => Object.values(data).some((v) => v !== undefined),
  { message: "Ao menos um campo deve ser informado" },
);

export const updateRoleSchema = z.object({
  role: roleSchema,
});

// --- Types ---

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
