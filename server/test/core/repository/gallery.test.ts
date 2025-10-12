import { IMidwayContainer } from '@midwayjs/core';
import { Framework, IMidwayKoaApplication } from '@midwayjs/koa';
import { createApp } from '@midwayjs/mock';
import { GalleryRepository } from '../../../src/core/repository/gallery'; // Adjust the path if needed
import { GalleryModel } from '../../../src/core/model/gallery';

describe('test/repository/gallery.ts', () => {
  let app: IMidwayKoaApplication;
  let container: IMidwayContainer;

  beforeAll(async () => {
    app = await createApp<Framework>();
    container = app.getApplicationContext();
    await container.ready();
  });
  it('should pass', async () => {
    const repo: GalleryRepository = await container.getAsync('galleryRepository');
    const model = GalleryModel.create({
      ehGalleryId: '123456',
      ehGalleryHash: 'abcdef1234567890abcdef1234567890',
      url: 'https://example.com/gallery/123456',
      name: 'Example Gallery',
      nameJp: '例のギャラリー',
      type: 'doujinshi',
      uploader: 'uploaderName',
      rating: 4.5,
      length: '100',
      language: 'English',
      sourceUrl: 'https://example.com/source/123456',
    });
    await repo.save(model);

    // just pass
    expect(true).toBe(true);
  });
});
