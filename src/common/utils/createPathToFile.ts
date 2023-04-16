export function createURLtoFile(filename: string) {
  return `${process.env.STATIC_URL}/api/files/${filename}`;
}
