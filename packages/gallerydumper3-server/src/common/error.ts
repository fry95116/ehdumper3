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
  DAL = 'DAL_ERROR',
}

export class ValidateError extends CommonError {
  constructor(message: string) {
    super(ErrorCodeEnum.Validate, message);
  }
}

export class NotFoundError extends CommonError {
  constructor(entityName: string) {
    super(ErrorCodeEnum.NotFound, `${entityName} not found`);
  }
}

export class DALError extends CommonError {
  constructor(message: string) {
    super(ErrorCodeEnum.DAL, message);
  }
}
