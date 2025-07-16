import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

// Get messages for a specific user
router.get("/", async (req, res) => {
  const { user } = req.query;
  if (!user) return res.status(400).json({ error: "Missing user" });
  try {
    const messages = await Message.find({ recipient: user })
      .sort({ timestamp: 1 })
      .exec();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Save message for a specific user
router.post("/", async (req, res) => {
  const { user, recipient, text } = req.body;
  if (!user || !recipient || !text)
    return res.status(400).json({ error: "Missing fields" });
  try {
    const message = new Message({ user, recipient, text });
    await message.save();
    // Note: Socket.io emit should be handled in main server file
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: "Failed to save message" });
  }
});

export default router;
