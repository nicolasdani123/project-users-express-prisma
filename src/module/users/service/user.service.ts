import AppError from "../../../core/error/appError.js";
import { UserRepository } from "../repository/user.repository.js";
import { CreateUserInput, IdUserInput, LoginInput, ResponseUserOutput, ListUsersResult, UpdateRoleInput, UpdateUserInput, EmailUserInput } from "../../../types/user.types.js";
import { responseUserSchema } from "../schema/user.response.schema.js";
// prisma and selectedResponse are accessed through the repository
import { hashPassword, comparePassword } from "../../../core/helper/password_hash.js";
import { Prisma } from "@prisma/client";
import buildUpdateData from "../../../core/helper/buildUpdateData.js";
import { generateToken } from "../../../core/helper/tokenJwt.js";

// standardized messages keep strings in one place
const MSG_USER_NOT_FOUND = "Usuário não encontrado";
const MSG_EMAIL_NOT_FOUND = "Email não encontrado";
const MSG_INVALID_CREDENTIALS = "Email ou senha inválidos";

export class UserService {
  constructor(private readonly repository: UserRepository) { }


  async findAll(): Promise<ResponseUserOutput[]> {

    const users = await this.repository.findAll()

    return responseUserSchema.array().parse(users)
  }

  async listUsers(page: number, limit: number): Promise<ListUsersResult> {
    // pagination logic has been pushed to the repository; service just delegates
    const result = await this.repository.list(page, limit);
    // the repository already returns typed data so we can pass it through
    return result;
  }


  async findById(id: IdUserInput): Promise<ResponseUserOutput> {

    const user = await this.repository.findById(id)
    if (!user) throw new AppError(MSG_USER_NOT_FOUND, 404);

    return responseUserSchema.parse(user)
  }

  async findByEmail(email: EmailUserInput) {

    const user = await this.repository.findByEmail(email)
    if (!user) {
      throw new AppError(MSG_EMAIL_NOT_FOUND, 404);
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

  async update(id: IdUserInput, data: UpdateUserInput): Promise<ResponseUserOutput> {

    const saveToHash = await buildUpdateData(data)

    await this.findById(id)

    const user = await this.repository.update(id, saveToHash)

    return responseUserSchema.parse(user)


  }

  async role(id:IdUserInput, data:UpdateRoleInput):Promise<void>{

     await this.findById(id)

     await this.repository.role(id, data)
     
  }

  async delete(id: IdUserInput): Promise<void> {
    await this.findById(id);
    await this.repository.deleteUser(id);
  }

  async softDelete(id: IdUserInput): Promise<void> {
    await this.findById(id);
    await this.repository.softDeleteUser(id);
  }

  async login(data: LoginInput): Promise<{ token: string; user: ResponseUserOutput }> {
    const userAuth = await this.repository.findByEmailForAuth(data.email);

    if (!userAuth) {
      throw new AppError(MSG_INVALID_CREDENTIALS, 401);
    }

    const passwordMatch = await comparePassword(data.password, userAuth.password_hash);

    if (!passwordMatch) {
      throw new AppError(MSG_INVALID_CREDENTIALS, 401);
    }

    const token = generateToken({
      sub: userAuth.id,
      email: userAuth.email,
      role: userAuth.role,
    });

    // remove password_hash before returning; other response fields are already
    // present thanks to the expanded select in findByEmailForAuth
    const { password_hash, ...user } = userAuth;

    return { token, user: responseUserSchema.parse(user) };
  }
}

