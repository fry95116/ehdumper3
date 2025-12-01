import { IMediaCreateParams, IMediaRestoreParams, Media } from './Media';

interface ITarFileExtraParams {
  tarFilePath: string;
  offset: number;
}

export interface ITarFileCreateParams extends IMediaCreateParams, ITarFileExtraParams {}
export interface ITarFileRestoreParams extends IMediaRestoreParams, ITarFileExtraParams {}
type ITarFileConstructorParams = ITarFileRestoreParams;

export class TarFileMedia extends Media {
  tarFilePath: string;
  offset: number;

  constructor(params: ITarFileConstructorParams) {
    super(params);
    this.tarFilePath = params.tarFilePath;
    this.offset = params.offset;
  }

  static create(params: ITarFileCreateParams): TarFileMedia {
    const media = new TarFileMedia(params);
    return media;
  }

  static restore(params: ITarFileRestoreParams) {
    const media = new TarFileMedia(params);
    return media;
  }
}
