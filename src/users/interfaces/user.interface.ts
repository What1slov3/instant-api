import type { UUID } from "common";

export interface IUser {
  id: UUID;
  email: string;
  username: string;
  tag: string;
  avatar: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}