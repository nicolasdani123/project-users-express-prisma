interface SuccessResponse<T> {
  success: true;
  message: string;
  status: number;
  data: T;
  timestamp: string;
}

function baseResponseSuccess<T>(
  message: string,
  data: T,
  status: number = 200,
): SuccessResponse<T> {
  return {
    success: true,
    message,
    status,
    data,
    timestamp: new Date().toISOString(),
  };
}

export default baseResponseSuccess;
