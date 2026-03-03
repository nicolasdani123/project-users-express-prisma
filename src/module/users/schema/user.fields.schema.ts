import { Role } from "@prisma/client";
import z from "zod";

// --- Field schemas (shared) ---

export const idUserSchema = z.string().uuid("ID inválido");

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Nome deve ter no mínimo 2 caracteres")
  .max(100, "Nome deve ter no máximo 100 caracteres");

export const emailSchema = z.string().trim().email("Email inválido").max(200);
export const passwordSchema = z.string().min(6, "Senha deve ter no mínimo 6 caracteres").max(100);
export const roleSchema = z.preprocess(val => typeof val === "string" ? val.toUpperCase() : val, z.nativeEnum(Role));
export const isActiveSchema = z.boolean();
export const dateSchema = z.coerce.date();
