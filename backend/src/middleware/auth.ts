import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request interface to include the decoded user payload
export interface AuthRequest extends Request {
  user?: string | jwt.JwtPayload;
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  const token = authHeader.split(" ")[1] ?? "";

  try {
    const secret = process.env.JWT_SECRET || "fallback_development_secret";
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // Attach user info to the request for the next route to use
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};
