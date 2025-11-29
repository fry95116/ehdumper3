import { Injectable } from '@nestjs/common';
import { readdir } from 'fs/promises';

@Injectable()
export class MideaService {
  getHello(): string {
    return 'Hello World!';
  }

  async scanLibrary(library: MediaLibrary) {
    // TODO: get path
    const files = await readdir(library.rootPath);

    return files;
  }
}
