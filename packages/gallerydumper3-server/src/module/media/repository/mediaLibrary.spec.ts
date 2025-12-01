import { Test } from '@nestjs/testing';
import { MediaLibraryRepository } from './mediaLibrary';
import { TarMediaLibrary } from '../model/TarMediaLibrary';
import { DirectoryMediaLibrary } from '../model/DirectoryLibrary';
import { LevelDAL } from '../dal/level';
import { NotFoundError } from '../../../common/error';
import { INestApplication } from '@nestjs/common';
import { SQLDAL } from '../dal/sql';

describe('MediaLibraryRepository', () => {
  let repo: MediaLibraryRepository;
  let app: INestApplication<any>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [MediaLibraryRepository, SQLDAL],
    }).compile();
    app = module.createNestApplication();
    await app.init();
    repo = module.get(MediaLibraryRepository);
  });

  afterAll(async () => {
    await app.close();
  });

  it('保存并读取 TAR 类型媒体库', async () => {
    const tar = TarMediaLibrary.create({
      name: 'tar-lib',
      filePath: '/path/to/file.tar',
    });
    await repo.save(tar);
    const restored = await repo.findByMediaLibraryId(tar.mediaLibraryId);
    expect(restored).toEqual(tar);
  });

  it('保存并读取 DIRECTORY 类型媒体库', async () => {
    const dir = DirectoryMediaLibrary.create({
      name: 'dir-lib',
      baseDir: '/path/to/dir',
    });
    await repo.save(dir);
    const restored = await repo.findByMediaLibraryId(dir.mediaLibraryId);
    expect(restored).toEqual(dir);
  });

  it('未找到媒体库时抛出 NotFoundError', async () => {
    await expect(repo.findByMediaLibraryId('missing-id')).rejects.toBeInstanceOf(NotFoundError);
  });
});
