import { genModelId } from '../../../common/uuid';
import {
  IMediaLibraryCreateParams,
  IMediaLibraryRestoreParams,
  MediaLibrary,
  MediaLibraryTypeEnum,
} from './MediaLibrary';

interface IDirectoryMediaLibraryExtraParams {
  baseDir: string;
}
export interface IDirectoryMediaLibraryCreateParams
  extends IMediaLibraryCreateParams, IDirectoryMediaLibraryExtraParams {}
export interface IDirectoryMediaLibraryRestoreParams
  extends IMediaLibraryRestoreParams, IDirectoryMediaLibraryExtraParams {}

export class DirectoryMediaLibrary extends MediaLibrary {
  baseDir: string;

  protected constructor(params: IDirectoryMediaLibraryRestoreParams) {
    super(params);
    this.baseDir = params.baseDir;
  }

  static create(params: IDirectoryMediaLibraryCreateParams): DirectoryMediaLibrary {
    const mediaLibrary = new DirectoryMediaLibrary({
      mediaLibraryId: genModelId('MEDIA_LIBRARY'),
      name: params.name,
      type: MediaLibraryTypeEnum.DIRECTORY,
      baseDir: params.baseDir,
      writable: true,
    });
    return mediaLibrary;
  }

  static restore(params: IDirectoryMediaLibraryRestoreParams): DirectoryMediaLibrary {
    const mediaLibrary = new DirectoryMediaLibrary(params);
    return mediaLibrary;
  }
}
