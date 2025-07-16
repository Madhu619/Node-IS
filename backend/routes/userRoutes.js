import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Create or get user profile
router.post("/", async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) return res.status(400).json({ error: "Missing fields" });
  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, name });
      await user.save();
      console.log(`Created new user: ${email} (${name})`);
    } else {
      console.log(`Found existing user: ${email} (${user.name})`);
    }
    res.status(201).json(user);
  } catch (err) {
    console.error("User creation/fetch error:", err);
    res.status(500).json({ error: "Failed to create or get user" });
  }
});

export default router;
