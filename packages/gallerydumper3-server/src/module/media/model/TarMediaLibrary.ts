import { assertTruth } from '../../../common/assert';
import { genModelId } from '../../../common/uuid';
import {
  IMediaLibraryCreateParams,
  IMediaLibraryRestoreParams,
  MediaLibrary,
  MediaLibraryTypeEnum,
} from './MediaLibrary';

interface ITarMediaLibraryExtraParams {
  filePath: string;
}
export interface ITarMediaLibraryCreateParams extends IMediaLibraryCreateParams, ITarMediaLibraryExtraParams {}
export interface ITarMediaLibraryRestoreParams extends IMediaLibraryRestoreParams, ITarMediaLibraryExtraParams {}

export class TarMediaLibrary extends MediaLibrary {
  filePath: string;

  protected constructor(params: ITarMediaLibraryRestoreParams) {
    super(params);
    this.filePath = params.filePath;
  }

  get extInfo() {
    return {
      filePath: this.filePath,
    };
  }

  set extInfo(value: { filePath: string }) {
    assertTruth(!!value.filePath, 'filePath is required in extInfo');
    this.filePath = value.filePath;
  }

  static create(params: ITarMediaLibraryCreateParams): TarMediaLibrary {
    const mediaLibrary = new TarMediaLibrary({
      mediaLibraryId: genModelId('MEDIA_LIBRARY'),
      name: params.name,
      type: MediaLibraryTypeEnum.TAR,
      filePath: params.filePath,
      writable: false,
    });
    return mediaLibrary;
  }

  static restore(params: ITarMediaLibraryRestoreParams): TarMediaLibrary {
    const mediaLibrary = new TarMediaLibrary(params);
    return mediaLibrary;
  }
}
