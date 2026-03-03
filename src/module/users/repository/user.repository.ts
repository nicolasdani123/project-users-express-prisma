import { Prisma } from "@prisma/client";
import selectedResponse from "../../../core/helper/selectedResponse.js";
import prisma from "../../../core/prisma/prismaClient.js";
import { IdUserInput } from "../schema/user.create.schema.js";
import { EmailUserInput } from "../schema/user.fields.schema.js";
import { ResponseUserOutput } from "../schema/user.response.schema.js";
import { UpdateUserInput } from "../schema/user.update.schema.js";



 export class UserRepository {


    async findAll():Promise<ResponseUserOutput[]>{

        return prisma.user.findMany({
            where: {is_active:true},
            orderBy:{
                created_at:"desc"
            },
            select:selectedResponse
        })
    }

    async findById(id:IdUserInput):Promise<ResponseUserOutput | null>{

        return prisma.user.findFirst({
            where:{id,is_active:true},
            select:selectedResponse
        })
    }

    async findByEmail(email:EmailUserInput):Promise<ResponseUserOutput | null>{

        return prisma.user.findFirst({
            where:{email,is_active:true},
            select:selectedResponse
        })
    }

    async create(data:Prisma.UserCreateInput):Promise<ResponseUserOutput>{
        return await prisma.user.create({
            data:data,
            select:selectedResponse
        })
    }

    async update(id:IdUserInput,data:Prisma.UserUpdateInput):Promise<ResponseUserOutput>{
            
        return await prisma.user.update({
            where:{id},
           data,
            select:selectedResponse
        })
       
    }
    
}

