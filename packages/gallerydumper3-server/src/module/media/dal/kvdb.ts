import { Injectable } from '@nestjs/common';
import { getConfig } from '../../../common/config';
import path from 'node:path';
import { Level } from 'level';

@Injectable()
export class KvdbDal {
  private collectionMap = new Map<string, Level>();

  protected getlevel(collection: string): Level {
    const leveldbConfig = getConfig().leveldb;
    const baseDir = leveldbConfig.baseDir;
    const collectionDir = path.join(baseDir, collection);
    if (!this.collectionMap.has(collectionDir)) {
      const level = new Level(collectionDir);
      this.collectionMap.set(collectionDir, level);
      return level;
    }
    return this.collectionMap.get(collectionDir);
  }

  async get(collection: string, key: string): Promise<string> {
    return this.getlevel(collection).get(key);
  }

  async put(collection: string, key: string, value: string): Promise<void> {
    await this.getlevel(collection).put(key, value);
  }

  async del(collection: string, key: string): Promise<void> {
    await this.getlevel(collection).del(key);
  }

  async clear(collection: string): Promise<void> {
    // TODO: 直接删除文件夹会更快
    await this.getlevel(collection).clear();
  }
}
