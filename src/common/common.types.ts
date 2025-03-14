export type UUID = `${string}-${string}-${string}-${string}-${string}`;

export type DBTimestamps = {
  createdAt: Date | string;
  updatedAt: Date | string;
};
