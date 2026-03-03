import UserRepository from "../repository/user.repository.js";
import { CreateUserInput, IdUserInput } from "../schema/user.create.schema.js";
import { UpdateUserInput } from "../schema/user.update.schema.js";
import { ResponseUserOutput, responseUserSchema } from "../schema/user.response.schema.js";
import buildUpdateData from "../../../core/helper/buildUpdateData.js";
import { Prisma } from "@prisma/client";
import { hashPassword } from "../../../core/helper/password_hash.js";
import AppError from "../../../core/error/appError.js";

class UserService {

  constructor(private readonly repository: UserRepository) { }
  async findAll(): Promise<ResponseUserOutput[]> {
    const users = await this.repository.findAll()
    return responseUserSchema.array().parse(users)

  }

  async findById(id: IdUserInput): Promise<ResponseUserOutput> {
    const user = await this.repository.findById(id)
    if (!user) throw new AppError("Usuário não encontrado", 404)
    return responseUserSchema.parse(user)
  }

  async update(id: IdUserInput, data: UpdateUserInput) {
    const updateData = await buildUpdateData(data)
    const user = await this.repository.update(id, updateData)
    return responseUserSchema.parse(user)
  }

  async create(data: CreateUserInput): Promise<ResponseUserOutput> {

    const { password, ...rest } = data

    const hash = await hashPassword(password)

    const emailExists = await this.repository.findByEmail(rest.email)
    if (emailExists) throw new AppError("Email já cadastrado", 409)

    const saveToHash: Prisma.UserCreateInput = {
      ...rest,
      password_hash: hash
    }

    const user = await this.repository.create(saveToHash)

    return responseUserSchema.parse(user)
  }

  async softDelete(id: IdUserInput): Promise<ResponseUserOutput> {
    const user = await this.repository.softDelete(id)

    return responseUserSchema.parse(user)

  }

  async delete(id:IdUserInput):Promise<void>{
    await this.repository.delete(id)
  }
}

export default UserService