import { Injectable, Inject } from '@nestjs/common';
import { MediaLibrary, MediaLibraryTypeEnum } from '../../../module/media/model/MediaLibrary';
import { TarMediaLibrary } from '../../../module/media/model/TarMediaLibrary';
import { DirectoryMediaLibrary } from '../../../module/media/model/DirectoryLibrary';

import { NotFoundError } from '../../../common/error';
import { assertEnum, assertTruth } from '../../../common/assert';
import { MediaLibraryNewDO, SQLDAL } from '../dal/sql';
import { safeJsonParse } from '../../../common/json';

@Injectable()
export class MediaLibraryRepository {
  @Inject()
  private sqlDAL: SQLDAL;

  async save(model: MediaLibrary): Promise<void> {
    const dataObject: MediaLibraryNewDO = model2DataObject(model);

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

  async findOneByMediaLibraryId(mediaLibraryId: string): Promise<MediaLibrary> {
    const founded = await this.sqlDAL.dataSource
      .selectFrom('mediaLibrary')
      .selectAll()
      .where('media_library_id', '=', mediaLibraryId)
      .executeTakeFirst();

    assertTruth(founded, new NotFoundError('MediaLibrary'));
    return dataObject2Model(founded);
  }
}

function model2DataObject(model: MediaLibrary) {
  const ext_info = JSON.stringify(model.extInfo);
  const dataObject: MediaLibraryNewDO = {
    media_library_id: model.mediaLibraryId,
    name: model.name,
    type: model.type,
    writable: model.writable ? 1 : 0,
    ext_info,
  };
  return dataObject;
}

function dataObject2Model(dataObject: {
  id: number;
  created_at: Date;
  updated_at: Date;
  media_library_id: string;
  name: string;
  type: MediaLibraryTypeEnum;
  writable: number;
  ext_info: MediaLibraryTypeEnum;
}) {
  assertEnum(dataObject.type, MediaLibraryTypeEnum);
  switch (dataObject.type) {
    case MediaLibraryTypeEnum.TAR: {
      const extInfo = safeJsonParse<{ filePath?: string }>(dataObject.ext_info, {});
      return TarMediaLibrary.restore({
        mediaLibraryId: dataObject.media_library_id,
        name: dataObject.name,
        type: dataObject.type,
        filePath: extInfo.filePath,
        writable: dataObject.writable !== 0,
      });
    }
    case MediaLibraryTypeEnum.DIRECTORY: {
      const extInfo = safeJsonParse<{ baseDir?: string }>(dataObject.ext_info, {});
      return DirectoryMediaLibrary.restore({
        mediaLibraryId: dataObject.media_library_id,
        name: dataObject.name,
        type: dataObject.type,
        baseDir: extInfo.baseDir,
        writable: dataObject.writable !== 0,
      });
    }
  }
}
