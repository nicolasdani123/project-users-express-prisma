import { Router } from "express";
import UserRepository from "../../module/users/repository/user.repository.js";
import UserService from "../../module/users/service/user.service.js";
import UserController from "../../module/users/controller/user.controller.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = Router()


const repository = new UserRepository();
const service = new UserService(repository)
const controller = new UserController(service)



router.get("", asyncHandler(controller.findAll.bind(controller)))
router.get("/:id", asyncHandler(controller.findById.bind(controller)))
router.patch("/:id", asyncHandler(controller.update.bind(controller)))
router.post("", asyncHandler(controller.create.bind(controller)))
router.patch("/:id/deactivate",asyncHandler(controller.softDelete.bind(controller)))
router.delete("/:id",asyncHandler(controller.delete.bind(controller)))

export default router