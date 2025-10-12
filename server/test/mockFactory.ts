import { uuid } from '../src/common/utils';
import { GalleryModel } from '../src/core/model/gallery';

export function mockGalleryModel(): GalleryModel {
  const mockEhGalleryId = uuid();
  const mockEhGalleryHash = uuid();

  const model = GalleryModel.create({
    ehGalleryId: mockEhGalleryId,
    ehGalleryHash: mockEhGalleryHash,
    url: `https://example.com/gallery/${mockEhGalleryId}`,
    name: 'Example Gallery',
    nameJp: '例のギャラリー',
    type: 'doujinshi',
    uploader: 'uploaderName',
    rating: 4.5,
    length: '100',
    language: 'English',
    sourceUrl: `https://example.com/source/${mockEhGalleryId}`,
  });
  return model;
}
