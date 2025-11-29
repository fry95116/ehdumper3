import { ValidateError } from './error';

export function assertTruth(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new ValidateError(message);
  }
}
