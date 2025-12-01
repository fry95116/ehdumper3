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
  DAL = 'DATA_ACCESS_ERROR',
}

export class ValidateError extends CommonError {
  constructor(message: string) {
    super(ErrorCodeEnum.Validate, message);
  }
}

export class NotFoundError extends CommonError {
  constructor(model: string) {
    super(ErrorCodeEnum.NotFound, `${model} not found`);
  }
}

export class EnumError extends CommonError {
  constructor(value: string, validValues: string[]) {
    super(ErrorCodeEnum.Validate, `value must be one of ${validValues.join(', ')}, but got ${value}`);
  }
}

export class DALError extends CommonError {
  constructor(message: string) {
    super(ErrorCodeEnum.DAL, `Data Access Layer Error: ${message}`);
  }
}
