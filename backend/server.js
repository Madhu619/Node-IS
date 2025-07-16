// API endpoint to get all conversations for a user
app.get("/api/conversations", async (req, res) => {
  try {
    const { user } = req.query;
    if (!user) {
      return res.status(400).json({ error: "User email required" });
    }
    const conversations = await Conversation.find({ user }).sort({
      createdAt: -1,
    });
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});
// Conversation model for saving full chat sessions
import mongoose from "mongoose";
const conversationSchema = new mongoose.Schema({
  user: String,
  name: String,
  messages: [
    {
      user: String,
      name: String,
      text: String,
      timestamp: Number,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});
const Conversation =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);
// API endpoint to save a full conversation
app.post("/api/conversations", async (req, res) => {
  try {
    const { user, name, messages } = req.body;
    if (
      !user ||
      !messages ||
      !Array.isArray(messages) ||
      messages.length === 0
    ) {
      return res.status(400).json({ error: "Invalid conversation data" });
    }
    const conversation = new Conversation({ user, name, messages });
    await conversation.save();
    res.status(201).json({ message: "Conversation saved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save conversation" });
  }
});
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import connectDB from "./db.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import Message from "./models/Message.js";
import dotenv from "dotenv";
// import { getHuggingFaceResponse } from "./huggingface.js";
dotenv.config();

const app = express();

const allowedOrigins = [
  //"https://<>.vercel.app", Update Vercel domain
  "http://localhost:3000",
  //"https://your-heroku-app.herokuapp.com", //Add your Heroku app domain here
];

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// Connect to MongoDB
connectDB();

// API routes
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

import { getAIResponse } from "./openai.js";

// Socket.io for real-time chat
io.on("connection", async (socket) => {
  console.log("A user connected");
  // Get user from query param
  const { user } = socket.handshake.query;
  if (user) {
    socket.join(user); // join room for this user
    try {
      const messages = await Message.find({ recipient: user })
        .sort({ timestamp: 1 })
        .exec();
      socket.emit("chat history", messages);
    } catch (err) {
      socket.emit("chat history", []);
    }
  }

  socket.on("chat message", async (msg) => {
    try {
      // Save user message
      const userMessage = new Message({
        user: msg.user,
        recipient: msg.recipient,
        text: msg.text,
        name: msg.name,
      });
      await userMessage.save();
      socket.emit("chat message", userMessage);
      io.to(msg.recipient).emit("chat message", userMessage);

      // OpenAI response (Node.js backend)
      const aiText = await getAIResponse(msg.text);
      const aiMessage = new Message({
        user: "ai",
        recipient: msg.recipient,
        text: aiText,
        name: "AstroBot",
      });
      await aiMessage.save();
      socket.emit("chat message", aiMessage);
      io.to(msg.recipient).emit("chat message", aiMessage);
    } catch (err) {
      // Optionally handle error
    }
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.post("/api/ai-chat", async (req, res) => {
  const { text } = req.body;
  try {
    const aiText = await getHuggingFaceResponse(text);
    res.json({ aiText });
  } catch (err) {
    res.status(500).json({ error: "AI response failed" });
  }
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
