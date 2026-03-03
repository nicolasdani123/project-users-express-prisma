class AppError extends Error {
  readonly statusCode: number;
  constructor(message: string, status: number = 500) {
    super(message);
    this.statusCode = status;
  }
}

export default AppError;
