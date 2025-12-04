import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/**
 * ADD PRODUCT
 * POST /api/vendor/products
 * Protected route (verifyToken is applied in server.js)
 */
router.post("/products", async (req, res) => {
  try {
    const vendorId = req.user.id; // Comes from verifyToken middleware
    const { name, description, price, image_url } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Product name is required." });
    }

    const result = await pool.query(
      `INSERT INTO products (vendor_id, name, description, price, image_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, description, price, image_url, created_at`,
      [vendorId, name, description || null, price || null, image_url || null]
    );

    return res.json({
      message: "Product added successfully",
      product: result.rows[0],
    });
  } catch (err) {
    console.error("Add Product Error:", err);
    return res.status(500).json({ error: "Failed to add product." });
  }
});

/**
 * GET ALL PRODUCTS OF LOGGED-IN VENDOR
 * GET /api/vendor/products
 */
router.get("/products", async (req, res) => {
  try {
    const vendorId = req.user.id;

    const result = await pool.query(
      "SELECT * FROM products WHERE vendor_id = $1 ORDER BY created_at DESC",
      [vendorId]
    );

    return res.json({
      products: result.rows,
    });
  } catch (err) {
    console.error("Get Products Error:", err);
    return res.status(500).json({ error: "Failed to fetch products." });
  }
});

/**
 * UPDATE PRODUCT
 * PUT /api/vendor/products/:id
 */
router.put("/products/:id", async (req, res) => {
  try {
    const vendorId = req.user.id;
    const productId = req.params.id;
    const { name, description, price, image_url } = req.body;

    // Ensure required fields
    if (!name) {
      return res.status(400).json({ error: "Product name is required." });
    }

    // Ensure vendor owns this product
    const productCheck = await pool.query(
      "SELECT * FROM products WHERE id = $1 AND vendor_id = $2",
      [productId, vendorId]
    );

    if (productCheck.rows.length === 0) {
      return res
        .status(403)
        .json({ error: "Not authorized to edit this product." });
    }

    // Update product
    const result = await pool.query(
      `UPDATE products
       SET name = $1,
           description = $2,
           price = $3,
           image_url = $4,
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [name, description || null, price || null, image_url || null, productId]
    );

    return res.json({
      message: "Product updated successfully",
      product: result.rows[0],
    });
  } catch (err) {
    console.error("Update Product Error:", err);
    return res.status(500).json({ error: "Failed to update product." });
  }
});

/**
 * DELETE PRODUCT
 * DELETE /api/vendor/products/:id
 */
router.delete("/products/:id", async (req, res) => {
  try {
    const vendorId = req.user.id;
    const productId = req.params.id;

    // Ensure vendor owns this product
    const productCheck = await pool.query(
      "SELECT * FROM products WHERE id = $1 AND vendor_id = $2",
      [productId, vendorId]
    );

    if (productCheck.rows.length === 0) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this product." });
    }

    // Delete product
    await pool.query("DELETE FROM products WHERE id = $1", [productId]);

    return res.json({
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error("Delete Product Error:", err);
    return res.status(500).json({ error: "Failed to delete product." });
  }
});

// GET /api/vendor/profile
router.get("/profile", async (req, res) => {
  try {
    const vendorId = req.user.id;

    const result = await pool.query(
      "SELECT id, name, owner_name, email, contact, category, city, description, logo_url, average_rating FROM vendors WHERE id = $1",
      [vendorId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    return res.json({ vendor: result.rows[0] });
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    return res.status(500).json({ error: "Server error fetching profile" });
  }
});

// PUT /api/vendor/profile
router.put("/profile", async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { name, owner_name, contact, category, city, description, logo_url } =
      req.body;

    await pool.query(
      `UPDATE vendors
       SET name = $1,
           owner_name = $2,
           contact = $3,
           category = $4,
           city = $5,
           description = $6,
           logo_url = $7,
           updated_at = NOW()
       WHERE id = $8`,
      [
        name,
        owner_name,
        contact,
        category,
        city,
        description,
        logo_url,
        vendorId,
      ]
    );

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ error: "Server error updating profile" });
  }
});

// GET /api/vendor/products/:id  (Get single product for editing)
router.get("/products/:id", async (req, res) => {
  try {
    const vendorId = req.user.id;
    const productId = req.params.id;

    // Ensure vendor only accesses THEIR OWN products
    const result = await pool.query(
      "SELECT * FROM products WHERE id = $1 AND vendor_id = $2",
      [productId, vendorId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ product: result.rows[0] });
  } catch (error) {
    console.error("Fetch Single Product Error:", error);
    res.status(500).json({ error: "Server error fetching product" });
  }
});

// POST /api/vendor/upload-logo
router.post("/upload-logo", async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { logo_url } = req.body;

    if (!logo_url) {
      return res.status(400).json({ error: "logo_url is required." });
    }

    await pool.query(
      `UPDATE vendors
       SET logo_url = $1,
           updated_at = NOW()
       WHERE id = $2`,
      [logo_url, vendorId]
    );

    return res.json({ message: "Vendor logo updated successfully" });
  } catch (error) {
    console.error("Vendor Logo Update Error:", error);
    return res.status(500).json({ error: "Failed to update vendor logo" });
  }
});

// POST /api/vendor/products/update-image
router.post("/products/update-image", async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { product_id, image_url } = req.body;

    if (!product_id || !image_url) {
      return res
        .status(400)
        .json({ error: "product_id and image_url are required." });
    }

    // Check ownership
    const check = await pool.query(
      "SELECT id FROM products WHERE id = $1 AND vendor_id = $2",
      [product_id, vendorId]
    );

    if (check.rows.length === 0) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this product image" });
    }

    await pool.query(
      `UPDATE products
       SET image_url = $1,
           updated_at = NOW()
       WHERE id = $2`,
      [image_url, product_id]
    );

    return res.json({ message: "Product image updated successfully" });
  } catch (error) {
    console.error("Product Image Update Error:", error);
    return res.status(500).json({ error: "Failed to update product image" });
  }
});

export default router;
