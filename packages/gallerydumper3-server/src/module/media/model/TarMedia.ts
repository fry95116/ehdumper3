import { genModelId } from '../../../common/uuid';
import { IMediaCreateParams, IMediaRestoreParams, Media, MediaStorageTypeEnum } from './Media';

interface ITarMediaExtraParams {
  tarFilePath: string;
  offset: number;
}

export interface ITarMediaCreateParams extends IMediaCreateParams, ITarMediaExtraParams {}
export interface ITarMediaRestoreParams extends IMediaRestoreParams, ITarMediaExtraParams {}
type ITarMediaConstructorParams = ITarMediaRestoreParams;

export class TarMedia extends Media {
  tarFilePath: string;
  offset: number;

  constructor(params: ITarMediaConstructorParams) {
    super(params);
    this.tarFilePath = params.tarFilePath;
    this.offset = params.offset;
  }

  static create(params: ITarMediaCreateParams): TarMedia {
    const media = new TarMedia({
      mediaId: genModelId('MEDIA'),
      mediaLibraryId: params.mediaLibraryId,
      collectionName: params.collectionName,
      fileName: params.fileName,
      ext: params.ext,
      size: params.size,
      storageType: MediaStorageTypeEnum.TAR,
      tarFilePath: params.tarFilePath,
      offset: params.offset,
    });
    return media;
  }

  static restore(params: ITarMediaRestoreParams) {
    const media = new TarMedia(params);
    return media;
  }
}
