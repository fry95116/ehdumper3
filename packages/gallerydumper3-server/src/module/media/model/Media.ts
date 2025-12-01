export enum MediaStorageTypeEnum {
  FILE = 'FILE',
  TAR = 'TAR',
}

export interface IMediaCreateParams {
  mediaLibraryId: string;
  collectionName: string;
  fileName: string;
  ext: string;
  size: number;
}

export interface IMediaRestoreParams extends IMediaCreateParams {
  mediaId: string;
  storageType: MediaStorageTypeEnum;
}

export abstract class Media {
  /** 媒体 ID */
  mediaId: string;
  /** 媒体库 ID */
  mediaLibraryId: string;
  /** 媒体目录名 */
  collectionName: string;
  /** 媒体文件名 */
  fileName: string;
  /** 媒体文件扩展名 */
  ext: string;
  /** 媒体文件大小，单位字节 */
  size: number;
  /** 媒体文件存储类型 */
  storageType: MediaStorageTypeEnum;

  protected constructor(params: IMediaRestoreParams) {
    this.mediaId = params.mediaId;
    this.mediaLibraryId = params.mediaLibraryId;
    this.collectionName = params.collectionName;
    this.fileName = params.fileName;
    this.ext = params.ext;
    this.size = params.size;
    this.storageType = params.storageType;
  }
}
