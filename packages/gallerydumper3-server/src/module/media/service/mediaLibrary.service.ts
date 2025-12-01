import { Inject, Injectable } from '@nestjs/common';
import { getConfig } from 'src/common/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Dir } from 'fs';
import { DirectoryMediaLibrary } from '../model/DirectoryLibrary';
import { MediaLibraryRepository } from '../repository/mediaLibrary';
import { TarMediaLibrary } from '../model/TarMediaLibrary';

@Injectable()
export class MideaLibraryService {
  @Inject()
  private mediaLibraryRepository: MediaLibraryRepository;

  async scan() {
    const baseDir = getConfig().file.baseDir;

    const items = await fs.readdir(baseDir);
    await Promise.all(
      items.map(async (item) => {
        const libraryPath = path.join(baseDir, item);
        const stats = await fs.stat(libraryPath);
        if (stats.isDirectory()) {
          const model = DirectoryMediaLibrary.create({ name: item, baseDir: libraryPath });
          await this.mediaLibraryRepository.save(model);
        } else if (stats.isFile() && item.endsWith('.tar')) {
          const model = TarMediaLibrary.create({ name: item, filePath: libraryPath });
          await this.mediaLibraryRepository.save(model);
        }
      }),
    );
  }
}
