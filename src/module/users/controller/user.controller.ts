import { createUserSchema } from "../schema/user.create.schema.js";
import { updateUserSchema } from "../schema/user.update.schema.js";
import { idUserSchema } from "../schema/user.fields.schema.js";
import { Request, Response } from "express";
import UserService from "../service/user.service.js";
import baseResponseSuccess from "../../../core/helper/baseResponseSuccess.js";
class UserController {

  constructor(private readonly service: UserService) { }

  async findAll(_req: Request, res: Response): Promise<void> {

    const users = await this.service.findAll()

    res.status(200).json(baseResponseSuccess("Listado com sucesso", users, 200))

  }

  async findById(req: Request, res: Response) {
    const id = req.params.id
    const idParsed = idUserSchema.parse(id)
    const users = await this.service.findById(idParsed)

    res.status(200).json(baseResponseSuccess("Usuário encontrado com sucesso", users, 200))

  }
  async update(req: Request, res: Response): Promise<void> {

    const id = req.params.id
    const body = req.body

    const idParsed = idUserSchema.parse(id)
    const bodyParsed = updateUserSchema.parse(body)

    const user = await this.service.update(idParsed, bodyParsed)
    res.status(200).json(baseResponseSuccess("Usuário atualizado com sucesso", user, 200))
  }


  async create(req: Request, res: Response): Promise<void> {

    const body = req.body

    const bodyParsed = createUserSchema.parse(body)

    const user = await this.service.create(bodyParsed)


    res.status(201).json(baseResponseSuccess("Usuário criado com sucesso", user, 201))

  }

  async softDelete(req:Request,res:Response):Promise<void>{

    const id = req.params.id

    const idParsed = idUserSchema.parse(id)

    const user = await this.service.softDelete(idParsed)

    res.status(200).json(baseResponseSuccess("Usuário desativado com sucesso",user,200))
  }

  async delete(req:Request,res:Response):Promise<void>{

    const id = req.params.id

    const idParsed = idUserSchema.parse(id)

    await this.service.delete(idParsed)
    res.sendStatus(204)
  }
}

export default UserController
