export const configuration = () => ({
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  baseUrl: process.env.BASE_URL,
  database: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    access: {
      expire: process.env.JWT_EXPIRE_TIME_ACCESS_TOKEN
        ? parseInt(process.env.JWT_EXPIRE_TIME_ACCESS_TOKEN)
        : 24,
    },
    refresh: {
      expire: process.env.JWT_EXPIRE_TIME_REFRESH_TOKEN
        ? parseInt(process.env.JWT_EXPIRE_TIME_REFRESH_TOKEN)
        : 730,
    },
  },
});
