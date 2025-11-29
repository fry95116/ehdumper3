import { createHash } from 'crypto';
import { findInsertIndex } from './find';

// 一致性哈希算法实现
type HashNode = {
  hash: number;
  node: string;
};

export class ConsistentHash {
  private ring: HashNode[] = [];
  private nodeSet: Set<string> = new Set();
  private virtualNodes: number;

  constructor(virtualNodes = 100) {
    this.virtualNodes = virtualNodes;
  }

  private hash(str: string): number {
    // 使用 md5 生成 hash，取前 8 字节转为数字
    const md5 = createHash('md5').update(str).digest('hex');
    return parseInt(md5.substring(0, 8), 16);
  }

  addNode(node: string) {
    if (this.nodeSet.has(node)) return;
    const inserted: number[] = [];
    for (let i = 0; i < this.virtualNodes; i++) {
      const vnodeKey = `${node}#${i}`;
      const hash = this.hash(vnodeKey);
      const { index, founded } = findInsertIndex(hash, this.ring, (n) => n.hash);
      if (founded) {
        // 回滚已插入的虚拟节点
        for (let j = inserted.length - 1; j >= 0; j--) {
          this.ring.splice(inserted[j], 1);
        }
        throw new Error(`虚拟节点 hash 冲突: ${vnodeKey} hash=${hash}`);
      }
      this.ring.splice(index, 0, { hash, node });
      inserted.push(index);
    }
    this.nodeSet.add(node);
  }

  removeNode(node: string) {
    if (!this.nodeSet.has(node)) return;
    this.nodeSet.delete(node);
    this.ring = this.ring.filter((n) => n.node !== node);
  }

  getNode(key: string): string | null {
    if (this.ring.length === 0) return null;
    const hash = this.hash(key);
    const { index, founded } = findInsertIndex(hash, this.ring, (n) => n.hash);
    // 环状结构，超过最大 hash 时回到第一个节点
    const nodeIndex = founded ? index : index + 1;
    return this.ring[nodeIndex % this.ring.length].node;
  }

  getNodes(): string[] {
    return Array.from(this.nodeSet);
  }
}
