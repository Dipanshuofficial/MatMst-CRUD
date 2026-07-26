import 'dotenv/config';
import mysql from "mysql2/promise"
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


async function setupDB() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ca: fs.readFileSync(__dirname + '/s=ca.pem'),
            rejectUnauthorized: true
        });
        console.log("✅ Connected to Aiven MySQL!");

        //     await connection.query(`
        //   CREATE TABLE IF NOT EXISTS Users (
        //       id INT AUTO_INCREMENT PRIMARY KEY,
        //       email VARCHAR(255) NOT NULL UNIQUE,
        //       password_hash VARCHAR(255) NOT NULL,
        //       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        //   )
        // `);
        //     console.log("✅ Users table created.");

        await connection.query(`
          CREATE TABLE IF NOT EXISTS MatMst (
          id INT AUTO_INCREMENT PRIMARY KEY,
          MatCode VARCHAR(50) NOT NULL,
          MatName VARCHAR(255) NOT NULL,
          MatQty INT DEFAULT 0,
          MatPrice DECIMAL(10, 2) DEFAULT 0.00,
          user_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE KEY uk_user_matcode (user_id, MatCode),
          FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
          )
        `);

        console.log("✅ MatMst table created.");
        await connection.end();
    } catch (err) {
        console.error("❌ Error:", err.message);
    }
}

setupDB();