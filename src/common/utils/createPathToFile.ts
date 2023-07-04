export function createURLtoFile(filename: string | null | undefined) {
  if (filename) {
    return `${process.env.STATIC_URL}/api/files/${filename}`;
  }
  return null
}
