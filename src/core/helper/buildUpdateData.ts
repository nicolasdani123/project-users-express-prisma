import { Prisma } from "@prisma/client";
import { UpdateUserInput } from "../../module/users/schema/user.update.schema.js";
import { hashPassword } from "./password_hash.js";

const buildUpdateData = async (data: UpdateUserInput): Promise<Prisma.UserUpdateInput> => {

    const { name, email, password } = data

    const updateData: Prisma.UserUpdateInput = {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(password !== undefined && { password_hash: await hashPassword(password) }),
    }

    return updateData

}
export default buildUpdateData