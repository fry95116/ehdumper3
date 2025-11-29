import { IMediaCreateParams, IMediaRestoreParams, Media } from './Media';

interface IFileExtraParams {
  filePath: string;
}
export interface IFileMediaCreateParams extends IMediaCreateParams, IFileExtraParams {}
export interface IFileMediaRestoreParams extends IMediaRestoreParams, IFileExtraParams {}
type IFileMediaConstructorParams = IFileMediaRestoreParams;

export class FileMedia extends Media {
  filePath: string;

  constructor(params: IFileMediaConstructorParams) {
    super(params);
    this.filePath = params.filePath;
  }

  static create(params: IFileMediaCreateParams): FileMedia {
    const media = new FileMedia(params);
    return media;
  }

  static restore(params: IFileMediaRestoreParams) {
    const media = new FileMedia(params);
    return media;
  }
}
