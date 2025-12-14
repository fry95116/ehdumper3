import { Test } from '@nestjs/testing';
import { MediaLibraryRepository } from './mediaLibrary';
import { TarMediaLibrary } from '../model/TarMediaLibrary';
import { DirectoryMediaLibrary } from '../model/DirectoryLibrary';
import { SQLDAL } from '../dal/sql';

describe('MediaLibraryRepository', () => {
  let repo: MediaLibraryRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [MediaLibraryRepository, SQLDAL],
    }).compile();
    const app = module.createNestApplication();
    await app.init();
    repo = module.get(MediaLibraryRepository);
  });

  it('save', async () => {
    const model = TarMediaLibrary.create({
      name: 'mock_name',
      filePath: '/mock/path',
    });

    const model2 = DirectoryMediaLibrary.create({
      name: 'mock_name2',
      baseDir: '/mock/path2',
    });

    await repo.save(model);
    await repo.save(model2);

    const saved = await repo.findOneByMediaLibraryId(model.mediaLibraryId);
    expect(saved).toStrictEqual(model);

    const saved2 = await repo.findOneByMediaLibraryId(model.mediaLibraryId);
    expect(saved2).toStrictEqual(model);
  });
});
