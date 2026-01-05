import { Injectable, Inject } from '@nestjs/common';
import { LevelDAL, LevelUnitEnum } from '../dal/level';
import { Media, MediaStorageTypeEnum } from '../model/Media';
import { safeJsonParse } from 'src/common/json';
import { FileMedia } from '../model/FileMedia';
import { TarFileMedia } from '../model/TarMedia';

@Injectable()
export class MediaRepository {
  @Inject()
  private readonly leveldal: LevelDAL;

  async findById(mediaId: string): Promise<Media> {
    const founded = await this.leveldal.get(LevelUnitEnum.Media, mediaId);
    const parsedDataObject = safeJsonParse<any>(founded, {});
    if (parsedDataObject.storageType === MediaStorageTypeEnum.FILE) {
      // TODO: validate
      return FileMedia.restore(parsedDataObject);
    } else if (parsedDataObject.storageType === MediaStorageTypeEnum.TAR_FILE) {
      return TarFileMedia.restore(parsedDataObject);
    }
    throw new Error(`Unsupported media storage type: ${parsedDataObject.storageType}`);
  }

  async save(data: Media): Promise<void> {
    if (data instanceof FileMedia) {
      const dataObject = {
        folderName: data.folderName,
        fileName: data.fileName,
        ext: data.ext,
        size: data.size,
        storageType: data.storageType,
        filePath: data.filePath,
      };
      await this.leveldal.put(LevelUnitEnum.Media, data.mediaId, JSON.stringify(dataObject));
    } else if (data instanceof TarFileMedia) {
      const dataObject = {
        folderName: data.folderName,
        fileName: data.fileName,
        ext: data.ext,
        size: data.size,
        storageType: data.storageType,
        tarFilePath: data.tarFilePath,
        offset: data.offset,
      };
      await this.leveldal.put(LevelUnitEnum.Media, data.mediaId, JSON.stringify(dataObject));
    }
  }
}
