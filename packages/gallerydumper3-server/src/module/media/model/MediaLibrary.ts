export interface IMediaLibraryCreateParams {
  name: string;
}

export interface IMediaLibraryRestoreParams extends IMediaLibraryCreateParams {
  type: MediaLibraryTypeEnum;
  mediaLibraryId: string;
  writable: boolean;
}

export interface IMediaLibraryConstructorParams extends IMediaLibraryRestoreParams {}

export enum MediaLibraryTypeEnum {
  TAR = 'TAR',
  DIRECTORY = 'DIRECTORY',
}

export abstract class MediaLibrary {
  mediaLibraryId: string;
  name: string;
  type: MediaLibraryTypeEnum;
  writable: boolean;

  protected constructor(params: IMediaLibraryConstructorParams) {
    this.mediaLibraryId = params.mediaLibraryId;
    this.name = params.name;
    this.type = params.type;
    this.writable = params.writable;
  }
}
