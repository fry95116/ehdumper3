import { ConsistentHash } from './consistentHash';

describe('ConsistentHash', () => {
  it('添加节点后能分布 key', () => {
    const ch = new ConsistentHash(10);
    ch.addNode('A');
    ch.addNode('B');
    ch.addNode('C');
    const node = ch.getNode('mykey');
    expect(['A', 'B', 'C']).toContain(node);
  });

  it('重复添加节点不会报错', () => {
    const ch = new ConsistentHash(10);
    ch.addNode('A');
    expect(() => ch.addNode('A')).not.toThrow();
  });

  it('删除节点后不再分配到该节点', () => {
    const ch = new ConsistentHash(10);
    ch.addNode('A');
    ch.addNode('B');
    ch.removeNode('A');
    expect(ch.getNodes()).toEqual(['B']);
    expect(ch.getNode('mykey')).toBe('B');
  });

  it('getNodes 返回所有节点', () => {
    const ch = new ConsistentHash(10);
    ch.addNode('A');
    ch.addNode('B');
    expect(ch.getNodes().sort()).toEqual(['A', 'B']);
  });

  it('虚拟节点 hash 冲突时抛出异常', () => {
    // 构造 hash 冲突场景
    const ch = new ConsistentHash(1);
    // 伪造 hash 方法
    // 让两个节点的虚拟节点 hash 相同
    // @ts-ignore
    ch.hash = () => 12345678;
    ch.addNode('A');
    expect(() => ch.addNode('B')).toThrow(/虚拟节点 hash 冲突/);
  });
});
