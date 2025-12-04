import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const router = express.Router();

/**
 * -----------------------------------------------
 * REGISTER VENDOR
 * -----------------------------------------------
 */
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      owner_name,
      email,
      contact,
      category,
      city,
      description,
      password,
    } = req.body;

    // Validate fields
    if (
      !name ||
      !owner_name ||
      !email ||
      !contact ||
      !category ||
      !city ||
      !password
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be filled." });
    }

    // Check if email exists
    const existingVendor = await pool.query(
      "SELECT email FROM vendors WHERE email = $1",
      [email]
    );

    if (existingVendor.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert vendor
    const result = await pool.query(
      `INSERT INTO vendors (
        name, owner_name, email, contact, category, city, description, password_hash
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING id, name, email, category, city`,
      [
        name,
        owner_name,
        email,
        contact,
        category,
        city,
        description || null,
        passwordHash,
      ]
    );

    res.json({
      message: "Vendor registered successfully.",
      vendor: result.rows[0],
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Server error during registration." });
  }
});

/**
 * -----------------------------------------------
 * LOGIN VENDOR
 * -----------------------------------------------
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    // Check email
    const vendorResult = await pool.query(
      "SELECT * FROM vendors WHERE email = $1",
      [email]
    );

    if (vendorResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const vendor = vendorResult.rows[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, vendor.password_hash);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Create token
    const token = jwt.sign(
      { id: vendor.id, email: vendor.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Clean vendor data
    const vendorData = {
      id: vendor.id,
      name: vendor.name,
      owner_name: vendor.owner_name,
      email: vendor.email,
      category: vendor.category,
      city: vendor.city,
      average_rating: vendor.average_rating,
    };

    res.json({
      message: "Login successful",
      token,
      vendor: vendorData,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error during login." });
  }
});

export default router;
