import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Level } from 'level';
import path from 'path';
import { getConfig } from 'src/common/config';
import { ConsistentHash } from 'src/common/consistentHash';

@Injectable()
export class MediaRepository implements OnModuleInit, OnModuleDestroy {
  private nodes: ConsistentHash;

  private leveldbs: Record<string, Level>;

  async onModuleInit() {
    const { baseDir, nodeCount } = getConfig().leveldb;
    this.nodes = new ConsistentHash();
    for (let i = 0; i < nodeCount; i++) {
      const subDir = path.join(baseDir, `node${i}`);
      this.nodes.addNode(subDir);
      this.leveldbs[subDir] = new Level(subDir);
    }
  }

  async onModuleDestroy() {
    await Promise.all(Object.values(this.leveldbs).map((db) => db.close()));
  }

  // async save(key: string): Promise<void> {
  //   const node = this.nodes.getNode(key);
  // }
}
