import { ObjectId } from 'bson';

export function genModelId(prefix: string): string {
  return prefix + '_' + new ObjectId().toHexString();
}
