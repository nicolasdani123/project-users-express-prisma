import { ErrorResponse, ValidationError } from "../../types/response.types.js";

function baseResponseError(
  message: string = "Erro no servidor",
  status: number = 500,
  errors: ValidationError[] = [],
): ErrorResponse {
  return {
    success: false,
    message,
    status,
    errors,
    timestamp: new Date().toISOString(),
  };
}

export default baseResponseError;