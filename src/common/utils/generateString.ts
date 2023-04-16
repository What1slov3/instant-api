export function generateString(length: number = 20) {
  const dict = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += dict[(Math.random() * dict.length) | 0];
  }
  return result;
}
