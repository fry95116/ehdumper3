import { createHash } from 'crypto';

export enum MediaStorageTypeEnum {
  FILE = 'FILE',
  TAR_FILE = 'TAR_FILE',
}

export interface IMediaCreateParams {
  mediaLibraryId: string;
  filepath: string;
  size: number;
  storageType: MediaStorageTypeEnum;
}

export interface IMediaRestoreParams extends IMediaCreateParams {}

export class Media {
  mediaLibraryId: string;
  /** 媒体文件名 */
  filepath: string;
  /** 媒体文件大小，单位字节 */
  size: number;
  /** 媒体文件存储类型 */
  storageType: MediaStorageTypeEnum;

  protected constructor(params: IMediaRestoreParams) {
    this.mediaLibraryId = params.mediaLibraryId;
    this.filepath = params.filepath;
    this.size = params.size;
    this.storageType = params.storageType;
  }

  get ext() {
    const parts = this.filepath.split('.');
    return parts.length === 1 ? '' : parts[parts.length - 1];
  }

  get mediaId() {
    const mediaId = createHash('md5').update(this.filepath).digest('hex');
    return mediaId;
  }

  // static create(params: IMediaConstructorParams): Media {
  //   const media = new Media({
  //     folderName: params.folderName,
  //     fileName: params.fileName,
  //     ext: params.ext,
  //     size: params.size,
  //     storageType: params.storageType,
  //   });
  //   return media;
  // }

  // static restore(params: IMediaRestoreParams): Media {
  //   const media = new Media(params);
  //   return media;
  // }
}
