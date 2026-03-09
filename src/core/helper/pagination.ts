export function sanitizePagination(
  page: number,
  limit: number
): { page: number; limit: number; skip: number } {
  const safePage = page < 1 ? 1 : page;
  const safeLimit = limit < 10 ? 10 : limit > 50 ? 50 : limit;
  const skip = (safePage - 1) * safeLimit;
  return { page: safePage, limit: safeLimit, skip };
}
