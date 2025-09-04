export interface JWTPayload {
  id: string;
  fullname: string;
  username: string;
  nickname: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}
