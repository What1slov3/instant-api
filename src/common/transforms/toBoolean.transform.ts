export function toBooleanTransform({ value }): boolean {
  if ([true, 'true', '1'].includes(value)) {
    return true;
  }
  return false;
}
