import { Prisma } from "@prisma/client";
import selectedResponse from "../../../core/helper/selectedResponse.js";
import prisma from "../../../core/prisma/prismaClient.js";
import { IdUserInput, ResponseUserOutput, ListUsersResult, PaginationResultMeta } from "../../../types/user.types.js";
import { EmailUserInput } from "../schema/user.fields.schema.js";
import { UpdateRoleInput } from "../schema/user.update.schema.js";
import {
  sanitizePagination,
} from "../../../core/helper/pagination.js";


export class UserRepository {

    async findAll(): Promise<ResponseUserOutput[]> {
        return prisma.user.findMany({
            where: { is_active: true },
            orderBy: {
                created_at: "desc"
            },
            select: selectedResponse
        });
    }

    async list(page: number, limit: number): Promise<ListUsersResult> {
        const { page: safePage, limit: safeLimit, skip } = sanitizePagination(page, limit);
        const where = { is_active: true };

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                orderBy: { created_at: "desc" },
                take: safeLimit,
                select: selectedResponse,
            }),
            prisma.user.count({ where }),
        ]);

        const meta: PaginationResultMeta = {
            total,
            page: safePage,
            perPage: safeLimit,
            totalPage: Math.ceil(total / safeLimit),
        };

        return { data: users, meta };
    }

    async findById(id: IdUserInput): Promise<ResponseUserOutput | null> {

        return prisma.user.findFirst({
            where: { id, is_active: true },
            select: selectedResponse
        })
    }

    async findByEmail(email: EmailUserInput): Promise<ResponseUserOutput | null> {

        return prisma.user.findFirst({
            where: { email, is_active: true },
            select: selectedResponse
        })
    }

    async create(data: Prisma.UserCreateInput): Promise<ResponseUserOutput> {
        return await prisma.user.create({
            data: data,
            select: selectedResponse
        })
    }

    async update(id: IdUserInput, data: Prisma.UserUpdateInput): Promise<ResponseUserOutput> {

        return await prisma.user.update({
            where: { id },
            data,
            select: selectedResponse
        })

    }

    async role(id:IdUserInput,data:UpdateRoleInput):Promise<void>{
        await prisma.user.update({
             where:{id},
             data
        })
    }
    async deleteUser(id: IdUserInput): Promise<void> {
        await this.hardDeleteUser(id);
    }

    async hardDeleteUser(id: IdUserInput): Promise<void> {
        await prisma.user.delete({
            where: { id }
        })
    }

    async softDeleteUser(id: IdUserInput): Promise<void> {
        await prisma.user.update({
            where: { id },
            data: { is_active: false }
        })
    }

    async findByEmailForAuth(
        email: string
    ): Promise<(ResponseUserOutput & { password_hash: string }) | null> {
        return prisma.user.findFirst({
            where: { email, is_active: true },
            select: {
                ...selectedResponse,
                password_hash: true,
            },
        });
    }

}

