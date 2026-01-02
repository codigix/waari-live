const path = require("path");
const dotenv = require("dotenv");

const envFile = path.resolve(__dirname, "../.env");
dotenv.config({ path: envFile, override: true });

const toInt = (value, fallback) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

module.exports = {
  app: {
    env: process.env.NODE_ENV || "development",
    port: toInt(process.env.PORT, 3000),
  },
  database: {
    host: process.env.DB_HOST || "127.0.0.1",
    port: toInt(process.env.DB_PORT, 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    name: process.env.DB_NAME,
    connectionLimit: toInt(process.env.DB_CONNECTION_LIMIT, 10),
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || "change-me",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
  },
  admin: {
    email: process.env.DEFAULT_ADMIN_EMAIL || "codigixsuperadmin@gmail.com",
    password: process.env.DEFAULT_ADMIN_PASSWORD || "123456",
  },
};
