import { Test } from '@nestjs/testing';
import { LevelDAL, LevelUnitEnum } from './level';
import { INestApplication } from '@nestjs/common';

/**
 * 说明：
 * - 不使用 mock，直接操作 fixture 下的 LevelDB 目录
 * - 通过 LevelDAL.onModuleInit() 初始化
 * - 验证 put/get 与 findAll 的行为
 */

describe('LevelDAL 单测（不使用 mock）', () => {
  let dal: LevelDAL;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [LevelDAL],
    }).compile();
    dal = module.get(LevelDAL);
    await dal.onModuleInit();
  });

  beforeEach(async () => {
    await dal.onModuleDestroy();
    await dal.clearAll();
  });

  it('写入与读取（Media 单元）', async () => {
    const key = '测试Key-媒体-001';
    const value = '测试Value-媒体-001';

    await dal.put(LevelUnitEnum.Media, key, value);
    const got = await dal.get(LevelUnitEnum.Media, key);

    expect(got).toBe(value);
  });

  it('iterate: 遍历所有数据', async () => {
    const items = [
      ['media/1/a', 'A'],
      ['media/1/b', 'B'],
      ['media/2/a', 'C'],
      ['media/2/b', 'D'],
    ];
    for (const [k, v] of items) {
      await dal.put(LevelUnitEnum.Media, k, v);
    }
    const result: [string, string][] = [];
    for await (const [key, value] of dal.iterate(LevelUnitEnum.Media, {})) {
      result.push([key, value]);
    }
    expect(result.length).toBe(items.length);
    for (const [k, v] of items) {
      expect(result).toContainEqual([k, v]);
    }
  });

  it('iterate: prefix 筛选', async () => {
    await dal.put(LevelUnitEnum.Media, 'media/1/a', 'A');
    await dal.put(LevelUnitEnum.Media, 'media/1/b', 'B');
    await dal.put(LevelUnitEnum.Media, 'media/2/a', 'C');
    const result: [string, string][] = [];
    for await (const [key, value] of dal.iterate(LevelUnitEnum.Media, { prefix: 'media/1/' })) {
      result.push([key, value]);
    }
    expect(result).toEqual([
      ['media/1/a', 'A'],
      ['media/1/b', 'B'],
    ]);
  });

  it('iterate: from 指定起始', async () => {
    await dal.put(LevelUnitEnum.Media, 'media/1/a', 'A');
    await dal.put(LevelUnitEnum.Media, 'media/1/b', 'B');
    await dal.put(LevelUnitEnum.Media, 'media/1/c', 'C');
    const result: [string, string][] = [];
    for await (const [key, value] of dal.iterate(LevelUnitEnum.Media, { from: 'media/1/b' })) {
      result.push([key, value]);
    }
    expect(result).toEqual([
      ['media/1/b', 'B'],
      ['media/1/c', 'C'],
    ]);
  });

  it('iterate: limit 限制数量', async () => {
    await dal.put(LevelUnitEnum.Media, 'media/1/a', 'A');
    await dal.put(LevelUnitEnum.Media, 'media/1/b', 'B');
    await dal.put(LevelUnitEnum.Media, 'media/1/c', 'C');
    const result: [string, string][] = [];
    for await (const [key, value] of dal.iterate(LevelUnitEnum.Media, { prefix: 'media/1/', limit: 2 })) {
      result.push([key, value]);
    }
    expect(result.length).toBe(2);
    expect(result[0][0]).toBe('media/1/a');
    expect(result[1][0]).toBe('media/1/b');
  });

  it('iterate: from + limit', async () => {
    await dal.put(LevelUnitEnum.Media, 'media/1/a', 'A');
    await dal.put(LevelUnitEnum.Media, 'media/1/b', 'B');
    await dal.put(LevelUnitEnum.Media, 'media/1/c', 'C');
    const result: [string, string][] = [];
    for await (const [key, value] of dal.iterate(LevelUnitEnum.Media, { from: 'media/1/b', limit: 1 })) {
      result.push([key, value]);
    }
    expect(result).toEqual([['media/1/b', 'B']]);
  });

  it('iterate: prefix + from', async () => {
    await dal.put(LevelUnitEnum.Media, 'media/1/a', 'A');
    await dal.put(LevelUnitEnum.Media, 'media/1/b', 'B');
    await dal.put(LevelUnitEnum.Media, 'media/1/c', 'C');
    await dal.put(LevelUnitEnum.Media, 'media/2/a', 'D');
    const result: [string, string][] = [];
    for await (const [key, value] of dal.iterate(LevelUnitEnum.Media, { prefix: 'media/1/', from: 'media/1/b' })) {
      result.push([key, value]);
    }
    expect(result).toEqual([
      ['media/1/b', 'B'],
      ['media/1/c', 'C'],
    ]);
  });

  it('iterate: prefix + from + limit', async () => {
    await dal.put(LevelUnitEnum.Media, 'media/1/a', 'A');
    await dal.put(LevelUnitEnum.Media, 'media/1/b', 'B');
    await dal.put(LevelUnitEnum.Media, 'media/1/c', 'C');
    await dal.put(LevelUnitEnum.Media, 'media/1/d', 'D');
    const result: [string, string][] = [];
    for await (const [key, value] of dal.iterate(LevelUnitEnum.Media, {
      prefix: 'media/1/',
      from: 'media/1/b',
      limit: 2,
    })) {
      result.push([key, value]);
    }
    expect(result).toEqual([
      ['media/1/b', 'B'],
      ['media/1/c', 'C'],
    ]);
  });
});
