import React from "react";

interface MessageItemProps {
  user: string;
  text: string;
  timestamp: number;
}

const MessageItem: React.FC<MessageItemProps> = ({ user, text, timestamp }) => (
  <div style={{ marginBottom: "1rem" }}>
    <span style={{ color: "#ffd54f", fontWeight: "bold" }}>{user}</span>
    <span style={{ color: "#fff", marginLeft: "0.5rem" }}>{text}</span>
    <span style={{ color: "#b3a1e6", fontSize: "0.8rem", marginLeft: "1rem" }}>
      {new Date(timestamp).toLocaleTimeString()}
    </span>
  </div>
);

export default MessageItem;
