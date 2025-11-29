export function safeJsonParse<T>(v: string, defaultValue: T): T {
  try {
    return JSON.parse(v);
  } catch (err: any) {
    console.log(err);
    return defaultValue;
  }
}
