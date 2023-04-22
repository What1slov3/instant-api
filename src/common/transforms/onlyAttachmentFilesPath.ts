export function onlyAttachmentFilesPath({ value }: { value: string[] }): string[] {
  return value.map((v) => new URL(v).pathname.slice(4));
}
