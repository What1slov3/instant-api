export const getRandomFromArray = <T>(arr: readonly T[]) => {
  return arr[Math.floor(Math.random() * arr.length)];
};
