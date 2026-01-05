import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConsistentHash } from '../../../common/consistentHash';
import { IteratorOptions, Level } from 'level';
import * as path from 'node:path';
import { getConfig } from '../../../common/config';
import { assertTruth } from '../../../common/assert';
import { DALError } from '../../../common/error';

export enum LevelUnitEnum {
  Media = 'media',
  Folder = 'folder',
}

class LevelUnit {
  private consistentHash: ConsistentHash;
  private levels: Record<string, Level>;
  private partitioner: (key: string) => string;

  constructor(name: LevelUnitEnum, baseDir: string, nodeCount = 1, partitioner?: (key: string) => string) {
    this.consistentHash = new ConsistentHash();
    this.levels = {};
    this.partitioner = partitioner ?? ((key: string) => key);
    for (let i = 0; i < nodeCount; i++) {
      const subDir = path.join(baseDir, `${name}_node${i}`);
      this.consistentHash.addNode(subDir);
      this.levels[subDir] = new Level(subDir);
    }
  }

  async open() {
    await Promise.all(Object.values(this.levels).map((db) => db.open()));
  }

  async close() {
    await Promise.all(Object.values(this.levels).map((db) => db.close()));
  }

  getLevel(key: string): Level {
    const partitionKey = this.partitioner(key);
    const node = this.consistentHash.getNode(partitionKey);
    assertTruth(node, new DALError('No available Level node'));
    return this.levels[node];
  }

  getLevels(): Level[] {
    return this.consistentHash.getNodes().map((node) => this.levels[node]);
  }
}

@Injectable()
export class LevelDAL implements OnModuleInit, OnModuleDestroy {
  private unitMap: Record<LevelUnitEnum, LevelUnit>;

  async onModuleInit() {
    const leveldbConfig = getConfig().leveldb;
    let baseDir = leveldbConfig.baseDir;

    if (process.env.NODE_ENV === 'test') {
      const lastIdx = baseDir.length - 1;

      baseDir =
        leveldbConfig.baseDir[lastIdx] === path.sep
          ? `${leveldbConfig.baseDir.slice(0, lastIdx)}_${Date.now()}`
          : `${leveldbConfig.baseDir}_${Date.now()}`;
    }

    this.unitMap = {
      [LevelUnitEnum.Media]: new LevelUnit(LevelUnitEnum.Media, baseDir, leveldbConfig.nodeCount ?? 1),
      [LevelUnitEnum.Folder]: new LevelUnit(LevelUnitEnum.Folder, baseDir, leveldbConfig.nodeCount ?? 1),
    };
  }

  async onModuleDestroy() {}

  put(unit: LevelUnitEnum, key: string, value: string) {
    return this.unitMap[unit].getLevel(key).put(key, value);
  }

  get(unit: LevelUnitEnum, key: string) {
    return this.unitMap[unit].getLevel(key).get(key);
  }

  del(unit: LevelUnitEnum, key: string) {
    return this.unitMap[unit].getLevel(key).del(key);
  }

  clearAll() {
    const promises: Promise<void>[] = [];
    for (const unit of Object.values(this.unitMap)) {
      for (const level of unit.getLevels()) {
        if (level.status === 'open') {
          promises.push(level.clear());
        }
      }
    }
    return Promise.all(promises);
  }
}
