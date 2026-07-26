import { type Response } from "express";
import pool from "../config/db.js";
import { type MatMst } from "../types/matmst.js";
import { type ResultSetHeader, type RowDataPacket } from "mysql2";
import type { AuthRequest } from "../middleware/auth.js";

export const createMaterial = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { MatCode, MatName, MatQty, MatPrice } = req.body;
    const userId = (req.user as any).id;

    await pool.query(
      "INSERT INTO MatMst (MatCode, MatName, MatQty, MatPrice, user_id) VALUES (?, ?, ?, ?, ?)",
      [MatCode, MatName, MatQty, MatPrice, userId],
    );

    res.status(201).json({ message: "Material created successfully" });
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).json({
        message: `MatCode "${req.body.MatCode}" already exists in your inventory`,
      });
      return;
    }
    console.error(error);
    res.status(500).json({ message: "Error creating material" });
  }
};

export const getAllMaterials = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = (req.user as any).id;
    const [rows] = await pool.query<(MatMst & RowDataPacket)[]>(
      "SELECT * FROM MatMst WHERE user_id = ?",
      [userId],
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving materials" });
  }
};

export const updateMaterial = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { MatCode } = req.params;
    const { MatName, MatQty, MatPrice } = req.body;
    const userId = (req.user as any).id;

    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE MatMst SET MatName = ?, MatQty = ?, MatPrice = ? WHERE MatCode = ? AND user_id = ?",
      [MatName, MatQty, MatPrice, MatCode, userId],
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Material not found or unauthorized" });
      return;
    }

    res.json({ message: "Material updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating material" });
  }
};

export const deleteMaterial = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { MatCode } = req.params;
    const userId = (req.user as any).id;

    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM MatMst WHERE MatCode = ? AND user_id = ?",
      [MatCode, userId],
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Material not found or unauthorized" });
      return;
    }

    res.json({ message: "Material deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting material" });
  }
};

export const bulkCreateMaterial = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const materials = req.body;

    if (!Array.isArray(materials) || materials.length === 0) {
      res
        .status(400)
        .json({ message: "Invalid payload, expected an array of materials" });
      return;
    }

    const invalidRow = materials.findIndex(
      (m: any) => !m.MatCode || !m.MatName,
    );
    if (invalidRow !== -1) {
      res.status(400).json({
        message: `Row ${invalidRow + 1} is missing MatCode or MatName`,
      });
      return;
    }

    const userId = (req.user as any).id;

    // Transform array of objects into array of arrays for MySQL bulk insert
    const values = materials.map((m: any) => [
      m.MatCode,
      m.MatName,
      m.MatQty,
      m.MatPrice,
      userId,
    ]);

    // Upgrade to an UPSERT: Insert if new, Update if already exists (MySQL 8.4+ compliant)
    await pool.query(
      `INSERT INTO MatMst (MatCode, MatName, MatQty, MatPrice, user_id) 
       VALUES ? AS new_materials
       ON DUPLICATE KEY UPDATE 
       MatName = new_materials.MatName, 
       MatQty = new_materials.MatQty, 
       MatPrice = new_materials.MatPrice`,
      [values],
    );

    res.status(201).json({ message: "Materials mass imported successfully" });
  } catch (error) {
    console.error("Mass import database error:", error);
    res.status(500).json({
      message: "Error mass creating materials.",
      error: (error as Error).message,
    });
  }
};
