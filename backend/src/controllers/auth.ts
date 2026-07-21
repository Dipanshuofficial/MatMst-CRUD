import { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { type RowDataPacket } from "mysql2";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM Users WHERE email = ?",
      [email],
    );

    if (rows.length === 0) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const user = rows[0]!;

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const secret = process.env.JWT_SECRET || "fallback_development_secret";
    const token = jwt.sign({ id: user.id, email: user.email }, secret, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Hash the password with a salt round of 10
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query("INSERT INTO Users (email, password_hash) VALUES (?, ?)", [
      email,
      hashedPassword,
    ]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during registration" });
  }
};
