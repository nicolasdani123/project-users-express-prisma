import baseResponseSuccess from "../../../core/helper/baseResponseSuccess.js";
import { createUserSchema } from "../schema/user.create.schema.js";
import { emailSchema, idUserSchema } from "../schema/user.fields.schema.js";
import { updateUserSchema } from "../schema/user.update.schema.js";
import { UserService } from "../service/user.service.js";
import { Request, Response } from "express";





export class UserController {

    constructor(private readonly service: UserService) {}

    async findAll(req: Request, res: Response): Promise<void> {
        const page = Number(req.query.page) || 1
        const limit  = Number(req.query.limit)  || 10
        const listUsers = await this.service.listUsers(page,limit)
        res.status(200).json(baseResponseSuccess(" Usuario listado com succeso", listUsers, 200))

    }


    async findById(req:Request,res:Response):Promise<void>{
        const id = req.params.id
        const idParsed = idUserSchema.parse(id)

        const user = await this.service.findById(idParsed)

        res.status(200).json(baseResponseSuccess("Usuario encontrado com succeso",user,200))
    }


    async findByEmail(req:Request,res:Response):Promise<void>{
        const email = req.params.email

        const emailParsed = emailSchema.parse(email)

        const user = await this.service.findByEmail(emailParsed)

        res.status(200).json(baseResponseSuccess("Usuario encontrado com succeso",user,200))

        
    }

    async create(req:Request,res:Response):Promise<void>{

        const body = req.body
        const bodyParsed =  createUserSchema.parse(body)


        const user = await this.service.create(bodyParsed)

         res.status(201).json(baseResponseSuccess("Usuario criado com succeso",user,201))
    }


    async update(req:Request,res:Response):Promise<void>{
        const id = req.params.id
        const body = req.body

        const idParsed= idUserSchema.parse(id)
        const bodyParsed = updateUserSchema.parse(body)

        const user = await this.service.update(idParsed,bodyParsed)

        res.status(200).json(baseResponseSuccess("Usuario atualizado com succeso",user,200))
    }
}