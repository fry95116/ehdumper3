import { genModelId } from '../../../common/uuid';
import { IMediaCreateParams, IMediaRestoreParams, Media, MediaStorageTypeEnum } from './Media';

interface IFileExtraParams {
  filePath: string;
}
export interface IFileMediaCreateParams extends IMediaCreateParams, IFileExtraParams {}
export interface IFileMediaRestoreParams extends IMediaRestoreParams, IFileExtraParams {}
interface IFileMediaConstructorParams extends IFileMediaRestoreParams {}

export class FileMedia extends Media {
  filePath: string;

  protected constructor(params: IFileMediaConstructorParams) {
    super(params);
    this.filePath = params.filePath;
  }

  static create(params: IFileMediaCreateParams): FileMedia {
    const media = new FileMedia({
      mediaId: genModelId('MEDIA'),
      mediaLibraryId: params.mediaLibraryId,
      collectionName: params.collectionName,
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
