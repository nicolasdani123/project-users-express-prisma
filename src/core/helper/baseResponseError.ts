interface ValidationError {
  field: string;
  message: string;
}

interface ErrorResponse {
  success: false;
  message: string;
  status: number;
  errors: ValidationError[];
  timestamp: string;
}

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