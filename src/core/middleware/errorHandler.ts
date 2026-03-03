import { ErrorRequestHandler } from "express";
import AppError from "../error/appError.js";
import baseResponseError from "../helper/baseResponseError.js";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);

  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json(baseResponseError(err.message, err.statusCode));
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res
        .status(409)
        .json(baseResponseError("Dados já existem", 409));
    }
    if (err.code === "P2025") {
      return res
        .status(404)
        .json(baseResponseError("Registro não encontrado", 404));
    }
  }

  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    return res
      .status(400)
      .json(baseResponseError("Dados inválidos", 400, formattedErrors));
  }

  return res.status(500).json(baseResponseError("Erro interno", 500));
};

export default errorHandler;