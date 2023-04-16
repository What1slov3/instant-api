export function constructDTO<T, K extends keyof T>(
  obj: T,
  keys: K[],
  transforms?: {
    add?: Record<string, any>;
    mutate?: Partial<Record<K, (field: any) => any>>;
  },
): Record<K, any> {
  const result: any = { ...transforms?.add };
  keys.forEach((key) => {
    if (transforms?.mutate?.[key]) {
      return (result[key] = transforms.mutate[key](obj[key]));
    }
    result[key] = obj[key];
  });
  return result;
}