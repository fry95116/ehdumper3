export class CommonError extends Error {
  errorCode: string;
  errorMessage: string;
  constructor(code: ErrorCodeEnum, message: string) {
    super(`${code}: ${message}`);
    this.name = this.errorCode = code;
    this.errorMessage = message;
  }
}

const enum ErrorCodeEnum {
  NotFound = 'NOT_FOUND',
  Validate = 'VALIDATE_ERROR',
}

export class ValidateError extends CommonError {
  constructor(message: string) {
    super(ErrorCodeEnum.Validate, message);
  }
}
