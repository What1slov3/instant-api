export type TAccessTokenPayload = {
  sub: string;
};

export type TRefreshTokenPayload = {
  sub: string;
  id: string;
}