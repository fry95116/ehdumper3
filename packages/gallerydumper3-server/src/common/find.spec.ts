import { findInsertIndex } from './find';

describe('findInsertIndex', () => {
  it('空数组应返回0，未找到', () => {
    expect(findInsertIndex(5, [], (x) => x)).toEqual({
      index: 0,
      founded: false,
    });
  });

  it('hash最小时应插入头部，未找到', () => {
    const arr = [10, 20, 30];
    expect(findInsertIndex(5, arr, (x) => x)).toEqual({
      index: 0,
      founded: false,
    });
  });

  it('hash最大时应插入尾部，未找到', () => {
    const arr = [10, 20, 30];
    expect(findInsertIndex(40, arr, (x) => x)).toEqual({
      index: 3,
      founded: false,
    });
  });

  it('hash在中间时应插入正确位置，未找到', () => {
    const arr = [10, 20, 30];
    expect(findInsertIndex(25, arr, (x) => x)).toEqual({
      index: 2,
      founded: false,
    });
    expect(findInsertIndex(15, arr, (x) => x)).toEqual({
      index: 1,
      founded: false,
    });
  });

  it('等于某值时应插入到该值前，founded为true', () => {
    const arr = [10, 20, 30];
    expect(findInsertIndex(20, arr, (x) => x)).toEqual({
      index: 1,
      founded: true,
    });
  });

  it('支持对象数组', () => {
    const arr = [{ h: 10 }, { h: 20 }, { h: 30 }];
    expect(findInsertIndex(25, arr, (x) => x.h)).toEqual({
      index: 2,
      founded: false,
    });
    expect(findInsertIndex(20, arr, (x) => x.h)).toEqual({
      index: 1,
      founded: true,
    });
  });

  it('重复值时只找到第一个', () => {
    const arr = [10, 20, 20, 30];
    expect(findInsertIndex(20, arr, (x) => x)).toEqual({
      index: 1,
      founded: true,
    });
  });
});
