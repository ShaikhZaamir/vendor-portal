import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// PUBLIC VENDOR PROFILE
router.get("/vendor/:id", async (req, res) => {
  try {
    const vendorId = req.params.id;

    const vendorResult = await pool.query(
      `SELECT id, name, owner_name, email, contact, category, city, description, logo_url, average_rating
       FROM vendors WHERE id = $1`,
      [vendorId]
    );

    if (vendorResult.rows.length === 0) {
      return res.status(404).json({ error: "Vendor not found." });
    }

    const vendor = vendorResult.rows[0];

    const productsResult = await pool.query(
      `SELECT id, name, description, price, image_url
       FROM products WHERE vendor_id = $1
       ORDER BY created_at DESC`,
      [vendorId]
    );

    vendor.products = productsResult.rows;

    return res.json(vendor);
  } catch (err) {
    console.error("Public Vendor Error:", err);
    return res.status(500).json({ error: "Failed to load vendor profile." });
  }
});

// PUBLIC VENDOR LISTING
router.get("/vendors", async (req, res) => {
  try {
    const search = req.query.search || "";
    const category = req.query.category || "";
    const sort = req.query.sort || "";

    let query = `
      SELECT id, name, category, city, logo_url, average_rating
      FROM vendors
    `;

    let params = [];
    let conditions = [];

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`name ILIKE $${params.length}`);
    }

    if (category) {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(" AND ");
    }

    if (sort === "rating_desc") query += " ORDER BY average_rating DESC";
    else if (sort === "rating_asc") query += " ORDER BY average_rating ASC";
    else query += " ORDER BY created_at DESC";

    const result = await pool.query(query, params);
    return res.json({ vendors: result.rows });
  } catch (err) {
    console.error("Vendor Listing Error:", err);
    return res.status(500).json({ error: "Failed to fetch vendor listing." });
  }
});


// ADD REVIEW (Public)
router.post("/vendor/:id/reviews", async (req, res) => {
  const vendorId = req.params.id;
  const { client_name, project, rating, comment } = req.body;

  if (!client_name || typeof rating === "undefined") {
    return res
      .status(400)
      .json({ error: "client_name and rating are required." });
  }

  const numericRating = Number(rating);
  if (
    !Number.isInteger(numericRating) ||
    numericRating < 1 ||
    numericRating > 5
  ) {
    return res
      .status(400)
      .json({ error: "rating must be an integer between 1 and 5." });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Ensure vendor exists
    const vRes = await client.query(
      "SELECT id FROM vendors WHERE id = $1 FOR UPDATE",
      [vendorId]
    );
    if (vRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Vendor not found." });
    }

    // Insert review
    const insertRes = await client.query(
      `INSERT INTO reviews (vendor_id, client_name, project, rating, comment)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, vendor_id, client_name, project, rating, comment, created_at`,
      [vendorId, client_name, project || null, numericRating, comment || null]
    );

    const review = insertRes.rows[0];

    // Recalculate average rating
    const avgRes = await client.query(
      `SELECT AVG(rating)::numeric(10,2) as avg_rating FROM reviews WHERE vendor_id = $1`,
      [vendorId]
    );
    const avgRating = parseFloat(avgRes.rows[0].avg_rating) || 0;

    // Update vendor
    await client.query(
      `UPDATE vendors SET average_rating = $1, updated_at = NOW() WHERE id = $2`,
      [avgRating, vendorId]
    );

    await client.query("COMMIT");

    return res.json({
      message: "Review added and rating updated.",
      review,
      average_rating: avgRating,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Add Review Error:", err);
    return res.status(500).json({ error: "Failed to add review." });
  } finally {
    client.release();
  }
});

// GET ALL REVIEWS FOR A VENDOR (Public)
router.get("/vendor/:id/reviews", async (req, res) => {
  try {
    const vendorId = req.params.id;

    const reviewsResult = await pool.query(
      `SELECT id, client_name, project, rating, comment, created_at
       FROM reviews
       WHERE vendor_id = $1
       ORDER BY created_at DESC`,
      [vendorId]
    );

    return res.json({
      reviews: reviewsResult.rows,
    });
  } catch (err) {
    console.error("Get Reviews Error:", err);
    return res.status(500).json({ error: "Failed to fetch reviews." });
  }
});

// GET /api/public/vendors-with-stats
router.get("/vendors-with-stats", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
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
      ORDER BY v.name ASC
    `);

    res.json({ vendors: result.rows });
  } catch (error) {
    console.error("Admin Vendor Stats Error:", error);
    res.status(500).json({ error: "Failed to load vendor stats" });
  }
});

export default router;
