import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../helper/tokenJwt.js";
import "../types/user.types.js";

const authMidleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Token não enviado" });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token não enviado" });
    return;
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    next(err);
  }
};

export default authMidleware;