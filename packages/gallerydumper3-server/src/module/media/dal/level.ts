import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConsistentHash } from '../../../common/consistentHash';
import { IteratorOptions, Level } from 'level';
import * as path from 'node:path';
import { getConfig } from '../../../common/config';
import { assertTruth } from '../../../common/assert';
import { DALError } from '../../../common/error';

export enum LevelUnitEnum {
  Media = 'media',
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
      [LevelUnitEnum.Media]: new LevelUnit(LevelUnitEnum.Media, baseDir, leveldbConfig.nodeCount ?? 1, (key: string) =>
        key.split('/').slice(0, 2).join('/'),
      ),
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

  iterate(unit: LevelUnitEnum, query?: { prefix?: string; from?: string; limit?: number }) {
    const levels = this.unitMap[unit].getLevels();
    const { prefix, from, limit } = query || {};
    if (from && prefix) {
      assertTruth(
        from.startsWith(prefix),
        new DALError(`from key must start with the prefix: from=${from}, prefix=${prefix}`),
      );
    }
    const asyncIterable = {
      async *[Symbol.asyncIterator]() {
        let iterated = 0;
        let started = !from; // 未提供 from 时，直接从第一个分区开始
        for (const level of levels) {
          // 计算该分区的起始 gte
          const opts: IteratorOptions<string, string> = {};
          if (!started && from) {
            // 仅在尚未开始且提供 from 时，尝试定位该分区是否包含 from
            try {
              const v = await level.get(from);
              if (v !== undefined) {
                started = true;
                opts.gte = from;
              } else if (prefix) {
                // 未命中 from，但有前缀则按前缀遍历，可能为空
                opts.gte = prefix;
              }
            } catch {
              // 不在该分区，若有前缀则设置 gte=prefix，否则保持 undefined 以从头开始
              if (started) {
                // 已经开始（不太可能在此分支），优先使用 prefix
                opts.gte = prefix;
              }
              // 若尚未开始，继续下一分区
            }
          } else {
            // 已经开始或者根本没有 from
            if (prefix) {
              opts.gte = prefix;
            }
          }

          for await (const [key, value] of level.iterator(opts)) {
            if (prefix && !key.startsWith(prefix)) {
              // 溢出前缀后，结束该分区遍历
              break;
            }
            if (limit !== undefined && iterated >= limit) {
              return;
            }
            // 若尚未开始但遇到与 from 相等的 key，则从这里开始
            if (from && !started) {
              if (key === from) {
                started = true;
              } else {
                continue;
              }
            }
            yield [key, value];
            iterated++;
          }

          // 全局数量限制控制
          if (limit !== undefined && iterated >= limit) {
            return;
          }
        }
      },
    };
    return asyncIterable;
  }
}
