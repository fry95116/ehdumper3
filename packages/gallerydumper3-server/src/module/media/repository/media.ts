import { Injectable, Inject } from '@nestjs/common';
import { Media, MediaStorageTypeEnum } from '../model/Media';
import { safeJsonParse } from '../../../common/json';
import { FileMedia } from '../model/FileMedia';
import { TarFileMedia } from '../model/TarMedia';
import { KvdbDal } from '../dal/kvdb';

@Injectable()
export class MediaRepository {
  @Inject()
  private readonly kvdbDal: KvdbDal;

  private getCollection(mediaLibraryId: string): string {
    return mediaLibraryId;
  }

  private data2Model(founded: string): Media {
    const parsedDataObject = safeJsonParse<any>(founded, {});
    if (parsedDataObject.storageType === MediaStorageTypeEnum.FILE) {
      // TODO: validate
      return FileMedia.restore(parsedDataObject);
    } else if (parsedDataObject.storageType === MediaStorageTypeEnum.TAR_FILE) {
      return TarFileMedia.restore(parsedDataObject);
    }
    throw new Error(`Unsupported media storage type: ${parsedDataObject.storageType}`);
  }

  async findOneByMediaLibraryIdAndMediaId(mediaLibraryId: string, mediaId: string): Promise<Media> {
    const founded = await this.kvdbDal.get(this.getCollection(mediaLibraryId), mediaId);
    return this.data2Model(founded);
  }

  async findOneByMediaLibraryIdAndFilepath(mediaLibraryId: string, filepath: string): Promise<Media> {
    const founded = await this.kvdbDal.get(this.getCollection(mediaLibraryId), `filepath/${filepath}`);
    return this.data2Model(founded);
  }

  async save(model: Media): Promise<void> {
    let data = '';
    if (model instanceof FileMedia) {
      data = JSON.stringify({
        ext: model.ext,
        size: model.size,
        storageType: model.storageType,
        filepath: model.filepath,
      });
    } else if (model instanceof TarFileMedia) {
      data = JSON.stringify({
        filepath: model.filepath,
        ext: model.ext,
        size: model.size,
        storageType: model.storageType,
        tarFilePath: model.tarFilePath,
        offset: model.offset,
      });
    }
    await this.kvdbDal.put(this.getCollection(model.mediaLibraryId), `filepath/${model.filepath}`, data);
    await this.kvdbDal.put(this.getCollection(model.mediaLibraryId), `mediaId/${model.mediaId}`, data);
  }
}
