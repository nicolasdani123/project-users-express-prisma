import { ResponseUserOutput } from "../module/users/schema/user.response.schema.js";
import { CreateUserInput, IdUserInput, LoginInput } from "../module/users/schema/user.create.schema.js";
import { UpdateUserInput, UpdateRoleInput } from "../module/users/schema/user.update.schema.js";
import { EmailUserInput } from "../module/users/schema/user.fields.schema.js";
import { PaginationResultMeta } from "./pagination.types.js";

export type { ResponseUserOutput, CreateUserInput, IdUserInput, LoginInput, UpdateUserInput, UpdateRoleInput, EmailUserInput, PaginationResultMeta };

export interface ListUsersResult {
  data: ResponseUserOutput[];
  meta: PaginationResultMeta;
}
