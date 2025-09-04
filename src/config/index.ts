export const config = {
  isProd: process.env.NODE_ENV === 'production',
  ACCESS_EXPIRES_MS: 30 * 60 * 1000, // 15m
  REFRESH_EXPIRES_MS: 7 * 24 * 60 * 60 * 1000, //7d
};
