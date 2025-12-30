export const jwtConstants = {
  accessSecret: process.env.JWT_ACCESS_SECRET || 'access_secret',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
  accessExpiresIn: 900,      // 15 minutes (seconds)
  refreshExpiresIn: 604800, // 7 days (seconds)
};
