import { CommonError, ValidateError } from './error';

export function assertTruth(condition: any, message: string | CommonError): asserts condition {
  if (!condition) {
    if (message instanceof CommonError) {
      throw message;
    }
    throw new ValidateError(message);
  }
}

export function assertEnum<T>(value: unknown, enumObject: T): asserts value is T[keyof T] {
  if (!Object.values(enumObject).includes(value as T[keyof T])) {
    throw new ValidateError(`Value ${value} is not a valid enum value of ${Object.keys(enumObject).join(', ')}`);
  }
}
