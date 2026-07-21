import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import matmstRoutes from "./routes/matmst.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:4200",
    credentials: true,
  }),
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/matmst", matmstRoutes);

// Start Server (Only run locally; Vercel handles this in production)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export the app for Vercel Serverless Functions
export default app;
