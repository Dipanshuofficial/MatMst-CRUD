import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import matmstRoutes from "./routes/matmst.js";

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = [
  "http://localhost:4200",
  "https://mat-mst-crud-d9oa.vercel.app",
];

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());

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
