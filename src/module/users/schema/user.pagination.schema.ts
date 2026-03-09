import z from "zod";

// Validates and sanitizes pagination query parameters.
export const paginationSchema = z
  .object({
    page: z
      .number()
      .int()
      .min(1)
      .default(1),
    limit: z
      .number()
      .int()
      .min(10)
      .max(50)
      .default(10),
  })
  .strict();

export type PaginationInput = z.infer<typeof paginationSchema>;
