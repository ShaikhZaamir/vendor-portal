import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import vendorRoutes from "./routes/vendor.js";
import { verifyToken } from "./middleware/auth.js";
import publicRoutes from "./routes/public.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

// Initialize app FIRST (very important)
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Public APIs
app.use("/api/public", publicRoutes);

// Auth
app.use("/api/auth", authRoutes);

// Admin 
app.use("/api/admin", adminRoutes);

// Vendor (protected)
app.use("/api/vendor", verifyToken, vendorRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Backend running..." });
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
