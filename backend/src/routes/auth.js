import express from "express";
import multer from "multer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer();
const router = express.Router();

// REGISTER VENDOR
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
      logo_url,
    } = req.body;

    // Cloudinary
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "vendor-logos" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          })
          .end(req.file.buffer);
      });

      logo_url = uploadResult.secure_url;
    }

    // VALIDATION
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

    // CHECK IF EMAIL EXISTS
    const exists = await pool.query("SELECT id FROM vendors WHERE email = $1", [
      email,
    ]);

    if (exists.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered." });
    }

    // HASH PASSWORD
    const hash = await bcrypt.hash(password, 10);

    // INSERT VENDOR
    const result = await pool.query(
      `INSERT INTO vendors
      (name, owner_name, email, contact, category, city, description, logo_url, password_hash)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING id, name, email, category, city, logo_url`,
      [
        name,
        owner_name,
        email,
        contact,
        category,
        city,
        description || null,
        logo_url,
        hash,
      ]
    );

    return res.json({
      message: "Vendor registered successfully.",
      vendor: result.rows[0],
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ error: "Server error during registration" });
  }
});

// LOGIN VENDOR
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    // Look up vendor
    const vendorResult = await pool.query(
      "SELECT * FROM vendors WHERE email = $1",
      [email]
    );

    if (vendorResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const vendor = vendorResult.rows[0];

    // Compare password hash
    const isMatch = await bcrypt.compare(password, vendor.password_hash);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Create JWT
    const token = jwt.sign(
      { id: vendor.id, email: vendor.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Clean vendor object (remove hash)
    const vendorData = {
      id: vendor.id,
      name: vendor.name,
      owner_name: vendor.owner_name,
      email: vendor.email,
      category: vendor.category,
      city: vendor.city,
      average_rating: vendor.average_rating,
      logo_url: vendor.logo_url,
    };

    return res.json({
      message: "Login successful",
      token,
      vendor: vendorData,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: "Server error during login" });
  }
});

export default router;
