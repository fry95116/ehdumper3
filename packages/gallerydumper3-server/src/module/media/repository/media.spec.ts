import { Test, TestingModule } from '@nestjs/testing';
import { MediaRepository } from './media';
import { KvdbDal } from '../dal/kvdb';
import { FileMedia } from '../model/FileMedia';
import { TarFileMedia } from '../model/TarMedia';
import { MediaStorageTypeEnum } from '../model/Media';

const mockKvdbDal = {
  get: jest.fn(),
  put: jest.fn(),
};

describe('MediaRepository', () => {
  let repository: MediaRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MediaRepository, { provide: KvdbDal, useValue: mockKvdbDal }],
    }).compile();
    repository = module.get(MediaRepository);
    jest.clearAllMocks();
  });

  describe('findOneByMediaLibraryIdAndMediaId', () => {
    it('should return FileMedia when storageType is FILE', async () => {
      const data = JSON.stringify({
        storageType: MediaStorageTypeEnum.FILE,
        ext: 'jpg',
        size: 123,
        filepath: '/a/b.jpg',
      });
      mockKvdbDal.get.mockResolvedValueOnce(data);
      jest.spyOn(FileMedia, 'restore').mockReturnValueOnce({ storageType: MediaStorageTypeEnum.FILE } as any);
      const result = await repository.findOneByMediaLibraryIdAndMediaId('lib1', 'id1');
      expect(result.storageType).toBe(MediaStorageTypeEnum.FILE);
    });

    it('should return TarFileMedia when storageType is TAR_FILE', async () => {
      const data = JSON.stringify({
        storageType: MediaStorageTypeEnum.TAR_FILE,
        ext: 'jpg',
        size: 123,
        filepath: '/a/b.jpg',
        tarFilePath: '/tar.tar',
        offset: 0,
      });
      mockKvdbDal.get.mockResolvedValueOnce(data);
      jest.spyOn(TarFileMedia, 'restore').mockReturnValueOnce({ storageType: MediaStorageTypeEnum.TAR_FILE } as any);
      const result = await repository.findOneByMediaLibraryIdAndMediaId('lib1', 'id1');
      expect(result.storageType).toBe(MediaStorageTypeEnum.TAR_FILE);
    });

    it('should throw error for unsupported storageType', async () => {
      const data = JSON.stringify({ storageType: 'UNKNOWN' });
      mockKvdbDal.get.mockResolvedValueOnce(data);
      await expect(repository.findOneByMediaLibraryIdAndMediaId('lib1', 'id1')).rejects.toThrow(
        'Unsupported media storage type: UNKNOWN',
      );
    });
  });

  describe('findOneByMediaLibraryIdAndFilepath', () => {
    it('should call kvdbDal.get with correct key', async () => {
      const data = JSON.stringify({ storageType: MediaStorageTypeEnum.FILE });
      mockKvdbDal.get.mockResolvedValueOnce(data);
      jest.spyOn(FileMedia, 'restore').mockReturnValueOnce({ storageType: MediaStorageTypeEnum.FILE } as any);
      await repository.findOneByMediaLibraryIdAndFilepath('lib2', '/foo.jpg');
      expect(mockKvdbDal.get).toHaveBeenCalledWith('lib2', 'filepath//foo.jpg');
    });
  });

  describe('save', () => {
    it('should save FileMedia correctly', async () => {
      const fileMedia = {
        mediaLibraryId: 'lib3',
        mediaId: 'id3',
        storageType: MediaStorageTypeEnum.FILE,
        ext: 'png',
        size: 456,
        filepath: '/bar.png',
      } as any;
      await repository.save(fileMedia);
      expect(mockKvdbDal.put).toHaveBeenCalledWith('lib3', 'filepath//bar.png', expect.any(String));
      expect(mockKvdbDal.put).toHaveBeenCalledWith('lib3', 'mediaId/id3', expect.any(String));
    });

    it('should save TarFileMedia correctly', async () => {
      const tarMedia = {
        mediaLibraryId: 'lib4',
        mediaId: 'id4',
        storageType: MediaStorageTypeEnum.TAR_FILE,
        ext: 'zip',
        size: 789,
        filepath: '/baz.zip',
        tarFilePath: '/tar2.tar',
        offset: 10,
      } as any;
      await repository.save(tarMedia);
      expect(mockKvdbDal.put).toHaveBeenCalledWith('lib4', 'filepath//baz.zip', expect.any(String));
      expect(mockKvdbDal.put).toHaveBeenCalledWith('lib4', 'mediaId/id4', expect.any(String));
    });
  });
});
