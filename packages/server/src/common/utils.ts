import { randomUUID } from 'node:crypto';
import { BaseError } from './error';

export function assertTruth(condition: any, err: BaseError) {
  if (!condition) {
    throw err;
  }
}

export function uuid() {
  return randomUUID().replace(/-/g, '');
}
