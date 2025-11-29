// 查找 hash 应插入/查找的位置
export function findInsertIndex<T>(hash: number, arr: T[], predict: (item: T) => number) {
  let l = 0,
    r = arr.length;
  while (l < r) {
    const m = Math.floor((l + r) / 2);
    if (predict(arr[m]) < hash) {
      l = m + 1;
    } else {
      r = m;
    }
  }
  return { index: l, founded: !!(arr[l] && predict(arr[l]) === hash) };
}
