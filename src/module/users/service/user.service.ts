import AppError from "../../../core/error/appError.js";
import { UserRepository } from "../repository/user.repository.js";
import { CreateUserInput, IdUserInput } from "../schema/user.create.schema.js";
import { ResponseUserOutput, responseUserSchema } from "../schema/user.response.schema.js";
import prisma from "../../../core/prisma/prismaClient.js";
import selectedResponse from "../../../core/helper/selectedResponse.js";
import { EmailUserInput } from "../schema/user.fields.schema.js";
import { hashPassword } from "../../../core/helper/password_hash.js";
import { Prisma } from "@prisma/client";
import { UpdateUserInput } from "../schema/user.update.schema.js";
import buildUpdateData from "../../../core/helper/buildUpdateData.js";

export class UserService {

  constructor(private readonly repository: UserRepository) { }


  async findAll(): Promise<ResponseUserOutput[]> {

    const users = await this.repository.findAll()

    return responseUserSchema.array().parse(users)
  }

  async listUsers(page: number, limit: number) {

    const safePage = page < 1 ? 1 : page
    const safeLimit = limit < 1 ? 10 : limit > 50 ? 50 : limit

    const skip = (safePage - 1) * safeLimit
    const where = { is_active: true }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: safeLimit,
        orderBy: { created_at: "desc" },
        select: selectedResponse
      }),
      prisma.user.count({ where })
    ])

    return {
      data: users,
      meta: {
        total,
        page: safePage,
        perPage: safeLimit,
        totalPages: Math.ceil(total / safeLimit)
      }
    }
  }


  async findById(id: IdUserInput): Promise<ResponseUserOutput> {

    const user = await this.repository.findById(id)
    if (!user) throw new AppError("Usuario não encontrado", 404)

    return responseUserSchema.parse(user)
  }

  async findByEmail(email: EmailUserInput) {

    const user = await this.repository.findByEmail(email)
    if (!user) {
      throw new AppError("Email não encontrado", 404)
    }
    return responseUserSchema.parse(user)
  }

  async create(data: CreateUserInput): Promise<ResponseUserOutput> {

    const { password, ...rest } = data

    const hash = await hashPassword(password)

    const saveToHash: Prisma.UserCreateInput = {
      ...rest,
      password_hash: hash
    }

    const user = await this.repository.create(saveToHash)

    return responseUserSchema.parse(user)

  }

  async update(id:IdUserInput,data:UpdateUserInput):Promise<ResponseUserOutput>{

      const saveToHash = await buildUpdateData(data)

      await this.findById(id)

      const user  = await this.repository.update(id,saveToHash)

      return responseUserSchema.parse(user)

      
  }

}