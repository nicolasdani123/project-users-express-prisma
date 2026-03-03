import { Prisma } from "@prisma/client";
import selectedResponse from "../../../core/helper/selectedResponse.js";
import prisma from "../../../core/prisma/prismaClient.js";
import { ResponseUserOutput } from "../schema/user.response.schema.js";
import { IdUserInput } from "../schema/user.create.schema.js";


class UserRepository {


  async findAll(): Promise<ResponseUserOutput[]> {

    return await prisma.user.findMany({
      where: { is_active: true },
      select: selectedResponse,
      orderBy: { created_at: "desc" }
    })
  }

  async findById(id: IdUserInput): Promise<ResponseUserOutput | null> {
    return await prisma.user.findUnique({
      where: { id, is_active: true },
      select: selectedResponse
    })
  }

  async update(id: IdUserInput, data: Prisma.UserUpdateInput): Promise<ResponseUserOutput> {
    return await prisma.user.update({
      where: { id, is_active: true },
      data: data,
      select: selectedResponse
    })
  }

  async create(data: Prisma.UserCreateInput): Promise<ResponseUserOutput> {

    return await prisma.user.create({
      data: data,
      select: selectedResponse
    })
  }

  async findByEmail(email: string): Promise<{ id: string } | null> {
    return await prisma.user.findUnique({
      where: { email, is_active: true },
      select: { id: true }
    })
  }

  async softDelete(id: IdUserInput): Promise<ResponseUserOutput> {

    return await prisma.user.update({
      where: { id },
      data: {
        is_active: false
      },
      select: selectedResponse
    })
  }

  async delete(id: IdUserInput): Promise<void> {
    await prisma.user.delete({
      where: { id, is_active: true },
    })
  }

}

export default UserRepository
