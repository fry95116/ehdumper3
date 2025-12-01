import { CommonError, EnumError } from './error';

export function assertTruth(condition: any, error: CommonError): asserts condition {
  if (!condition) {
    throw error;
  }
}

export function assertEnum<T>(value: any, enumObject: T): asserts value is T[keyof T] {
  const enumValues = Object.values(enumObject);
  if (!enumValues.includes(value)) {
    throw new EnumError(value, enumValues);
  }
}
