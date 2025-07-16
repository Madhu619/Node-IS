import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  user: String, // sender
  recipient: String, // owner of the chat (user viewing)
  text: String,
  name: String, // display name (for user or AI)
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
