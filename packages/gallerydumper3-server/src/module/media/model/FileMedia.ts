import { IMediaCreateParams, IMediaRestoreParams, Media, MediaStorageTypeEnum } from './Media';

export interface IFileMediaCreateParams extends Omit<IMediaCreateParams, 'storageType'> {}
export interface IFileMediaRestoreParams extends IMediaRestoreParams {}
type IFileMediaConstructorParams = IFileMediaRestoreParams;

export class FileMedia extends Media {
  constructor(params: IFileMediaConstructorParams) {
    super(params);
  }

  static create(params: IFileMediaCreateParams): FileMedia {
    const media = new FileMedia({
      mediaLibraryId: params.mediaLibraryId,
      size: params.size,
      storageType: MediaStorageTypeEnum.FILE,
      filepath: params.filepath,
    });
    return media;
  }

  static restore(params: IFileMediaRestoreParams) {
    const media = new FileMedia(params);
    return media;
  }
}
