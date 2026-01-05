import { IMediaCreateParams, IMediaRestoreParams, Media, MediaStorageTypeEnum } from './Media';

interface IFileExtraParams {
  filePath: string;
}
export interface IFileMediaCreateParams extends Omit<IMediaCreateParams, 'storageType'>, IFileExtraParams {}
export interface IFileMediaRestoreParams extends IMediaRestoreParams, IFileExtraParams {}
type IFileMediaConstructorParams = IFileMediaRestoreParams;

export class FileMedia extends Media {
  filePath: string;

  constructor(params: IFileMediaConstructorParams) {
    super(params);
    this.filePath = params.filePath;
  }

  static create(params: IFileMediaCreateParams): FileMedia {
    const media = new FileMedia({
      folderName: params.folderName,
      fileName: params.fileName,
      ext: params.ext,
      size: params.size,
      storageType: MediaStorageTypeEnum.FILE,
      filePath: params.filePath,
    });
    return media;
  }

  static restore(params: IFileMediaRestoreParams) {
    const media = new FileMedia(params);
    return media;
  }
}
