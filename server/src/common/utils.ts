import { BaseError } from './error';

export function assertTruth(condition: any, err: BaseError) {
  if (!condition) {
    throw err;
  }
}
