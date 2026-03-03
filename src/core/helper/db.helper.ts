import prisma from "../prisma/prismaClient.js";

/**
 * Re-export do Prisma Client como `db` (usado para $queryRaw, etc.)
 */
export const db = prisma;

export default db;
