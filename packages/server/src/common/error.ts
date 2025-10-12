// import { format } from 'node:util';

export class BaseError {
  public errorCode: string;
  public errorMessage: string;
  constructor(code: string, message: string) {
    this.errorCode = code;
    this.errorMessage = message;
  }
}

export enum RepositoryErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  UPDATE_DELETED = 'UPDATE_DELETED',
}

export class ValidateError extends BaseError {
  constructor(code: string, msg: string) {
    super(`VAILDATE_ERROR/${code}`, msg);
  }

  static required(key: string) {
    return new ValidateError('REQUIRED', `${key} is required`);
  }
}

export class RepositoryError extends BaseError {
  constructor(code: RepositoryErrorCode, model: string, id: string, msg: string) {
    super(`REPOSITORY_ERROR/${code}`, [msg, model, id].join(','));
  }
}

export class UpdateDeletedError extends RepositoryError {
  constructor(model: string, id: string) {
    super(RepositoryErrorCode.UPDATE_DELETED, model, id, '禁止更新已删除的记录');
  }
}

export class NotFoundError extends RepositoryError {
  constructor(model: string, id: string) {
    super(RepositoryErrorCode.NOT_FOUND, model, id, '记录未找到');
  }
}
