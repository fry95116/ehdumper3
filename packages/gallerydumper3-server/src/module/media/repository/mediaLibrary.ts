import { Injectable, Inject } from '@nestjs/common';
import { MediaLibrary, MediaLibraryTypeEnum } from '@/module/media/model/MediaLibrary';
import { TarMediaLibrary } from '@/module/media/model/TarMediaLibrary';
import { DirectoryMediaLibrary } from '@/module/media/model/DirectoryLibrary';

import { NotFoundError } from '@/common/error';
import { assertEnum, assertTruth } from '@/common/assert';
import { LevelDAL } from '../dal/level';
import { MediaLibraryDO, MediaLibraryNewDO, SQLDAL } from '../dal/sql';

@Injectable()
export class MediaLibraryRepository {
  @Inject()
  private sqlDAL: SQLDAL;

  async save(model: MediaLibrary): Promise<void> {
    const dataObject: MediaLibraryNewDO = {
      media_library_id: model.mediaLibraryId,
      name: model.name,
      type: model.type,
      writable: model.writable ? 1 : 0,
    };
    if (model instanceof TarMediaLibrary) {
      dataObject.ext_info = JSON.stringify({ filePath: model.filePath });
    }
    if (model instanceof DirectoryMediaLibrary) {
      dataObject.ext_info = JSON.stringify({ baseDir: model.baseDir });
    }

    const founded = await this.sqlDAL.dataSource
      .selectFrom('mediaLibrary')
      .selectAll()
      .where('media_library_id', '=', model.mediaLibraryId)
      .executeTakeFirst();
    if (founded) {
      await this.sqlDAL.dataSource
        .updateTable('mediaLibrary')
        .set(dataObject)
        .where('media_library_id', '=', model.mediaLibraryId)
        .execute();
      return;
    }
    await this.sqlDAL.dataSource.insertInto('mediaLibrary').values(dataObject).execute();
  }

  async findByMediaLibraryId(mediaLibraryId: string): Promise<MediaLibrary> {
    const dataObject = await this.sqlDAL.dataSource
      .selectFrom('mediaLibrary')
      .selectAll()
      .where('media_library_id', '=', mediaLibraryId)
      .executeTakeFirst();
    assertTruth(dataObject, new NotFoundError('MediaLibrary'));

    assertEnum(dataObject.type, MediaLibraryTypeEnum);
    switch (dataObject.type) {
      case MediaLibraryTypeEnum.TAR:
        return TarMediaLibrary.restore({
          mediaLibraryId: dataObject.media_library_id,
          name: dataObject.name,
          type: dataObject.type,
          filePath: dataObject.ext_info.filePath,
          writable: dataObject.writable,
        });
      case MediaLibraryTypeEnum.DIRECTORY:
        return DirectoryMediaLibrary.restore({
          mediaLibraryId: dataObject.media_library_id,
          name: dataObject.name,
          type: dataObject.type,
          baseDir: dataObject.ext_info.baseDir,
          writable: dataObject.writable,
        });
    }
  }
}
