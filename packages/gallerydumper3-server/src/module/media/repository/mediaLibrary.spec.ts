// import { Test } from '@nestjs/testing';
// import { MediaLibraryRepository } from './mediaLibrary';
// import { MediaLibrary, MediaLibraryType } from '../model/mediaLibrary';

// describe('MediaLibraryRepository', () => {
//   let repo: MediaLibraryRepository;

//   beforeAll(async () => {
//     const module = await Test.createTestingModule({
//       providers: [MediaLibraryRepository],
//     }).compile();
//     const app = module.createNestApplication();
//     await app.init();
//     repo = module.get(MediaLibraryRepository);
//   });

//   it('save', async () => {
//     const model = MediaLibrary.create({
//       name: 'mock_name',
//       rootPath: '/mock/path',
//       type: MediaLibraryType.LOCAL_FS,
//     });

//     const model2 = MediaLibrary.create({
//       name: 'mock_name2',
//       rootPath: '/mock/path2',
//       type: MediaLibraryType.LOCAL_TAR,
//     });

//     await repo.save(model);
//     await repo.save(model);

//     const saved = await repo.findByMediaLibraryId(model.mediaLibraryId);
//     expect(saved).toStrictEqual(model);
//   });
// });
