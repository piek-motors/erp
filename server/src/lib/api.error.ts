export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public stack?: string,
  ) {
    super(message)
  }
  static Unauthorized(message: string) {
    return new ApiError(401, message)
  }
  static BadRequest(message: string) {
    return new ApiError(400, message)
  }
}
