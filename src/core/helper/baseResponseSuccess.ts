import { SuccessResponse } from "../../types/response.types.js";

const baseResponseSuccess = <T>(message: string, data: T, status: number = 200): SuccessResponse<T> => {
  return {
    success: true,
    message,
    status,
    data,
    timestamp: new Date().toISOString(),
  };
};

export default baseResponseSuccess