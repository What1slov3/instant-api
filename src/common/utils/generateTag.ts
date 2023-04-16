export function generateTag() {
  let randNum: string = String((Math.random() * 10000) >> 0);
  return '0'.repeat(4 - randNum.length) + randNum;
}
