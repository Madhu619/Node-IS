import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import io from "socket.io-client";
import styles from "./ChatRoom.module.css";
import { useGlobalState } from "../GlobalState";

const ChatRoom: React.FC = () => {
  const globalState = useGlobalState();
  const email = globalState?.email || "";
  const name = globalState?.name || "";
  const router = useRouter();
  // Wait for globalState to load before redirecting
  React.useEffect(() => {
    if (globalState === null) return; // loading
    if (!email || !name) {
      router.replace("/");
    }
  }, [globalState, email, name, router]);
  type MessageType = {
    _id?: string;
    user: string;
    name?: string;
    text: string;
    timestamp: number;
  };
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [chatInput, setChatInput] = useState("");
  const socketRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!email) return;
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:4000", {
        query: { user: email },
      });
      socketRef.current.on("chat history", (msgs: MessageType[]) => {
        setMessages(msgs);
      });
      socketRef.current.on("chat message", (msg: MessageType) => {
        setMessages((prev) => {
          // If message has _id, replace any matching timestamp/text without _id
          if (msg._id) {
            const filtered = prev.filter(
              (m) =>
                !(
                  m.timestamp === msg.timestamp &&
                  m.text === msg.text &&
                  !m._id
                )
            );
            // If already present by _id, don't add
            if (filtered.some((m) => m._id === msg._id)) return filtered;
            return [...filtered, msg];
          }
          // If no _id, only add if not present by timestamp/text
          if (
            prev.some(
              (m) => m.timestamp === msg.timestamp && m.text === msg.text
            )
          )
            return prev;
          return [...prev, msg];
        });
      });
    }
    return () => {
      socketRef.current?.disconnect();
    };
  }, [email]);

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (chatInput.trim() && socketRef.current && email) {
      const newMessage = {
        user: email,
        name,
        recipient: email,
        text: chatInput,
        timestamp: Date.now(),
      };
      socketRef.current.emit("chat message", newMessage);
      setChatInput("");
      inputRef.current?.focus();

      // ...AI response logic removed; handled by backend via Socket.io...
    }
  };

  // Save conversation to backend
  const saveConversation = async () => {
    if (messages.length === 0) return;
    try {
      await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: email,
          name,
          messages,
        }),
      });
    } catch (err) {
      // Optionally handle error
    }
  };

  // Handle user leaving via button
  const handleLeave = async () => {
    await saveConversation();
    socketRef.current?.disconnect();
    router.push("/");
  };

  // Handle browser/tab close or refresh
  useEffect(() => {
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      // Show alert to user
      e.preventDefault();
      e.returnValue =
        "Are you sure you want to leave? Your conversation will be saved.";
      await saveConversation();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.cardTitle}>Welcome, {name}!</h2>
        <button className={styles.leaveButton} onClick={handleLeave}>
          Leave Chat
        </button>
      </div>
      <div className={styles.chatMessagesContainer}>
        {messages.length === 0 ? (
          <p style={{ color: "#b3a1e6", textAlign: "center" }}>
            No messages yet. Start the cosmic conversation!
          </p>
        ) : (
          messages.map((msg, idx) => {
            const isAI = msg.user === "ai" || msg.user === "openai";
            return (
              <div
                key={idx}
                className={isAI ? styles.messageRowLeft : styles.messageRow}
              >
                <div
                  className={
                    isAI ? styles.messageBubbleLeft : styles.messageBubble
                  }
                >
                  <span className={styles.messageUser}>
                    {msg.name || (isAI ? "AstroBot" : name)}
                  </span>
                  <span className={styles.messageText}>{msg.text}</span>
                  <span className={styles.messageTime}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
      <form className={styles.form} onSubmit={handleSend}>
        <input
          ref={inputRef}
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type your message..."
          className={styles.input}
          required
        />
        <button type="submit" className={styles.sendButton}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
