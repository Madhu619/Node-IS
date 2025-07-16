import React from "react";
import MessageItem from "../molecules/MessageItem";

interface MessageListProps {
  messages: { user: string; text: string; timestamp: number }[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => (
  <div
    style={{
      maxHeight: "300px",
      overflowY: "auto",
      marginBottom: "1rem",
      background: "rgba(20,20,40,0.5)",
      borderRadius: "8px",
      padding: "1rem",
    }}
  >
    {messages.length === 0 ? (
      <p style={{ color: "#b3a1e6", textAlign: "center" }}>
        No messages yet. Start the cosmic conversation!
      </p>
    ) : (
      messages.map((msg, idx) => <MessageItem key={idx} {...msg} />)
    )}
  </div>
);

export default MessageList;
