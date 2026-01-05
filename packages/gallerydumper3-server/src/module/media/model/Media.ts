import { createHash } from 'crypto';

export enum MediaStorageTypeEnum {
  FILE = 'FILE',
  TAR_FILE = 'TAR_FILE',
}

export interface IMediaCreateParams {
  folderName: string;
  fileName: string;
  ext: string;
  size: number;
  storageType: MediaStorageTypeEnum;
}

export interface IMediaRestoreParams extends IMediaCreateParams {}

export class Media {
  mediaLibraryId: string;
  /** 媒体文件组名 */
  folderName: string;
  /** 媒体文件名 */
  fileName: string;
  /** 媒体文件扩展名 */
  ext: string;
  /** 媒体文件大小，单位字节 */
  size: number;
  /** 媒体文件存储类型 */
  storageType: MediaStorageTypeEnum;

  protected constructor(params: IMediaRestoreParams) {
    this.folderName = params.folderName;
    this.fileName = params.fileName;
    this.ext = params.ext;
    this.size = params.size;
    this.storageType = params.storageType;
  }

  get mediaId() {
    const mediaId = createHash('md5').update(this.folderName).update(this.fileName).update(this.ext).digest('hex');
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
