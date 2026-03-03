import { RequestHandler } from "express";

const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req, res, next): void => {
    Promise.resolve(fn(req, res, next)).catch((error) => next(error));
  };
};

export default asyncHandler;
