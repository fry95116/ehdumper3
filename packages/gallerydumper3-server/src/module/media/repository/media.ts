import { Injectable, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import { LevelDAL, LevelUnitEnum } from '../dal/level';
import { Media, MediaStorageTypeEnum } from '../model/Media';
import { TarMedia } from '../model/TarMedia';
import { FileMedia } from '../model/FileMedia';
import { assertEnum, assertTruth } from 'src/common/assert';
import { NotFoundError } from 'src/common/error';

interface MediaDO {
  mediaId: string;
  mediaLibraryId: string;
  fileName: string;
  collectionName: string;
  ext: string;
  size: number;
  storageType: string;
  tarFilePath: string;
  offset: number;
  filePath: string;
}

@Injectable()
export class MediaRepository {
  @Inject()
  private levelDAL: LevelDAL;

  async save(model: Media) {
    const dataObject: MediaDO = {
      mediaId: model.mediaId,
      mediaLibraryId: model.mediaLibraryId,
      fileName: model.fileName,
      collectionName: model.collectionName,
      ext: model.ext,
      size: model.size,
      storageType: model.storageType,
      tarFilePath: '',
      offset: 0,
      filePath: '',
    };
    if (model instanceof TarMedia) {
      dataObject.tarFilePath = model.tarFilePath;
      dataObject.offset = model.offset;
    } else if (model instanceof FileMedia) {
      dataObject.filePath = model.filePath;
    }

    const key = `${dataObject.collectionName}/${dataObject.fileName}`;
    const value = JSON.stringify(dataObject);
    await this.levelDAL.put(LevelUnitEnum.Media, key, value);
  }

  async findOneByFolderAndFileName(collectionName: string, fileName: string): Promise<Media> {
    const key = `${collectionName}/${fileName}`;
    const rawData = await this.levelDAL.get(LevelUnitEnum.Media, key);
    assertTruth(rawData, new NotFoundError('Media'));
    const dataObject: MediaDO = JSON.parse(rawData);
    assertEnum(dataObject.storageType, MediaStorageTypeEnum);

    switch (dataObject.storageType) {
      case MediaStorageTypeEnum.TAR:
        return TarMedia.restore({
          mediaId: dataObject.mediaId,
          mediaLibraryId: dataObject.mediaLibraryId,
          collectionName: dataObject.collectionName,
          fileName: dataObject.fileName,
          ext: dataObject.ext,
          size: dataObject.size,
          storageType: dataObject.storageType,
          tarFilePath: dataObject.tarFilePath,
          offset: dataObject.offset,
        });
      case MediaStorageTypeEnum.FILE:
        return FileMedia.restore({
          mediaId: dataObject.mediaId,
          mediaLibraryId: dataObject.mediaLibraryId,
          collectionName: dataObject.collectionName,
          fileName: dataObject.fileName,
          ext: dataObject.ext,
          size: dataObject.size,
          storageType: dataObject.storageType as any,
          filePath: dataObject.filePath,
        });
    }
  }
}
