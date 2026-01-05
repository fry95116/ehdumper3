import { Test, TestingModule } from '@nestjs/testing';
import { MediaRepository } from './media';
import { KvdbDal } from '../dal/kvdb';
import { MediaStorageTypeEnum } from '../model/Media';
import * as sinon from 'sinon';

let sandbox: sinon.SinonSandbox;

describe('MediaRepository 媒体仓库', () => {
  let repository: MediaRepository;
  let kvdbDal: KvdbDal;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();

    const module: TestingModule = await Test.createTestingModule({
      providers: [MediaRepository, KvdbDal],
    }).compile();
    repository = module.get(MediaRepository);
    kvdbDal = module.get(KvdbDal);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('findOneByMediaLibraryIdAndMediaId', () => {
    it('当 storageType 为 FILE 时应返回 FileMedia', async () => {
      const data = JSON.stringify({
        storageType: MediaStorageTypeEnum.FILE,
        ext: 'jpg',
        size: 123,
        filepath: '/a/b.jpg',
      });
      const mockGet = sandbox.stub(kvdbDal, 'get').resolves(data);
      const result = await repository.findOneByMediaLibraryIdAndMediaId('lib1', 'id1');
      expect(result.storageType).toBe(MediaStorageTypeEnum.FILE);
      expect(mockGet.callCount).toBe(1);
    });

    it('当 storageType 为 TAR_FILE 时应返回 TarFileMedia', async () => {
      const data = JSON.stringify({
        storageType: MediaStorageTypeEnum.TAR_FILE,
        ext: 'jpg',
        size: 123,
        filepath: '/a/b.jpg',
        tarFilePath: '/tar.tar',
        offset: 0,
      });
      const mockGet = sandbox.stub(kvdbDal, 'get').resolves(data);
      const result = await repository.findOneByMediaLibraryIdAndMediaId('lib1', 'id1');
      expect(result.storageType).toBe(MediaStorageTypeEnum.TAR_FILE);
      expect(mockGet.callCount).toBe(1);
    });

    it('遇到不支持的 storageType 应抛出异常', async () => {
      const data = JSON.stringify({ storageType: 'UNKNOWN' });
      const mockGet = sandbox.stub(kvdbDal, 'get').resolves(data);
      await expect(repository.findOneByMediaLibraryIdAndMediaId('lib1', 'id1')).rejects.toThrow(
        'Unsupported media storage type: UNKNOWN',
      );
      expect(mockGet.callCount).toBe(1);
    });
  });

  describe('findOneByMediaLibraryIdAndFilepath', () => {
    it('应使用正确的 key 调用 kvdbDal.get', async () => {
      const data = JSON.stringify({ storageType: MediaStorageTypeEnum.FILE });
      const mockGet = sandbox.stub(kvdbDal, 'get').resolves(data);
      await repository.findOneByMediaLibraryIdAndFilepath('lib2', '/foo.jpg');
      expect(mockGet.calledWith('lib2', 'filepath//foo.jpg')).toBeTruthy();
    });
  });

  describe('save', () => {
    it('应正确保存 FileMedia', async () => {
      const fileMedia = {
        mediaLibraryId: 'lib3',
        mediaId: 'id3',
        storageType: MediaStorageTypeEnum.FILE,
        ext: 'png',
        size: 456,
        filepath: '/bar.png',
      } as any;
      const mockPut = sandbox.stub(kvdbDal, 'put');
      await repository.save(fileMedia);
      expect(mockPut.calledWith('lib3', 'filepath//bar.png', sinon.match.string)).toBeTruthy();
      expect(mockPut.calledWith('lib3', 'mediaId/id3', sinon.match.string)).toBeTruthy();
    });

    it('应正确保存 TarFileMedia', async () => {
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
      const mockPut = sandbox.stub(kvdbDal, 'put');
      await repository.save(tarMedia);
      expect(mockPut.calledWith('lib4', 'filepath//baz.zip', sinon.match.string)).toBeTruthy();
      expect(mockPut.calledWith('lib4', 'mediaId/id4', sinon.match.string)).toBeTruthy();
    });
  });
});
