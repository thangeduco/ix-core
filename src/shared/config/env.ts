import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: Number(process.env.PORT || 3000),
  NODE_ENV: process.env.NODE_ENV || "development",
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: Number(process.env.DB_PORT || 5432),
  DB_NAME: process.env.DB_NAME || "ix",
  DB_USER: process.env.DB_USER || "ix",
  DB_PASSWORD: process.env.DB_PASSWORD || "ix"
};
