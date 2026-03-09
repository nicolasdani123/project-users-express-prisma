export interface ValidationError {
  field: string;
  message: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  status: number;
  errors: ValidationError[];
  timestamp: string;
}

export interface SuccessResponse<T> {
  success: true;
  message: string;
  status: number;
  data: T;
  timestamp: string;
}
