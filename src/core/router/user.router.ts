import { Router } from "express";
import { UserController } from "../../module/users/controller/user.controller.js";
import { UserRepository } from "../../module/users/repository/user.repository.js";
import { UserService } from "../../module/users/service/user.service.js";
import asyncHandler from "../middleware/asyncHandler.js";



const repository = new UserRepository()
const service = new UserService(repository)
const controller = new UserController(service)


  const router = Router()

router.get("",asyncHandler(controller.findAll.bind(controller)))
router.get("/email/:email",asyncHandler(controller.findByEmail.bind(controller)))
router.get("/:id",asyncHandler(controller.findById.bind(controller)))
router.post("",asyncHandler(controller.create.bind(controller)))
router.patch("/:id",asyncHandler(controller.update.bind(controller)))
export default router
