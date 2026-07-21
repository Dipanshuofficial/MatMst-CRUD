import mysql, { type PoolOptions } from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

// Enforce environment variables at startup
const requiredEnvs = [
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
] as const;

for (const env of requiredEnvs) {
  if (!process.env[env]) {
    throw new Error(`Missing required environment variable: ${env}`);
  }
}

// Strictly type the pool configuration
const dbConfig: PoolOptions = {
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER ?? "",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? "",
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync("./ca.pem"), // Ready to uncomment if a custom CA file is ever needed
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

export default pool;
