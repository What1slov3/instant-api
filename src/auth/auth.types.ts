import type { IUser } from "users/interfaces";

export type AccessTokenPayload = {
  subId: IUser['id'];
};

export type RefreshTokenPayload = {
  subId: IUser['id'];
  id: string;
}