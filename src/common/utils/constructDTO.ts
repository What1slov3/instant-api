export function constructDTO<T, K extends keyof T>(
  obj: T,
  keys: K[],
  transforms?: {
    add?: Record<string, any>;
    mutate?: Partial<Record<K, (field: any) => any> | any>;
    mutateFieldName?: Partial<Record<K, string>>;
  },
): Record<K, any> {
  const result: any = { ...transforms?.add };
  keys.forEach((key) => {
    const mutatedKey = transforms?.mutateFieldName?.[key] ? transforms.mutateFieldName[key] : key;
    if (transforms?.mutate?.[key]) {
      return (result[mutatedKey] =
        typeof transforms.mutate[key] === 'function' ? transforms.mutate[key](obj[key]) : transforms.mutate[key]);
    }
    result[mutatedKey] = obj[key];
  });
  return result;
}
