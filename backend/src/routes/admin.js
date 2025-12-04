import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/**
 * ADMIN — Get Vendor List with Ratings + Review Count
 * GET /api/admin/vendors
 */
router.get("/vendors", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         v.id,
         v.name,
         v.category,
         v.city,
         v.logo_url,
         v.average_rating,
         COUNT(r.id) AS review_count
       FROM vendors v
       LEFT JOIN reviews r ON v.id = r.vendor_id
       GROUP BY v.id
       ORDER BY v.created_at DESC`
    );

    return res.json({ vendors: result.rows });
  } catch (err) {
    console.error("Admin Vendor List Error:", err);
    return res
      .status(500)
      .json({ error: "Failed to fetch admin vendor list." });
  }
});

export default router;
