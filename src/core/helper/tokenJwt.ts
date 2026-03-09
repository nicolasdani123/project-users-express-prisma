import jwt from "jsonwebtoken";
import { TokenPayload } from "../../types/auth.types.js";
import AppError from "../error/appError.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "changeme_secret";
// seconds — default 86400 = 1 day
const JWT_EXPIRES_IN = Number(process.env.JWT_EXPIRES_IN_SECONDS) || 86400;

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    throw new AppError("Token inválido ou expirado", 401);
  }
}
