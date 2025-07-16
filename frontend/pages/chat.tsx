/// <reference types="next" />
/// <reference types="next/types/global" />

export {};

import React from "react";
import { useRouter } from "next/router";
import ChatRoom from "../components/ChatRoom/ChatRoom";
import styles from "./Home.module.css";

const ChatPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <ChatRoom />
    </div>
  );
};

export default ChatPage;
