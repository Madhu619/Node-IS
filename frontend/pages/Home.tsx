import React, { useState, useEffect, useRef } from "react";
import styles from "./Home.module.css";
import { useSetGlobalState } from "../components/GlobalState";

type StarryBackgroundProps = {};

function StarryBackground(props: StarryBackgroundProps) {
  return (
    <div className={styles.starry}>
      {[...Array(100)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            background: "#fff",
            borderRadius: "50%",
            opacity: Math.random() * 0.7 + 0.3,
          }}
        />
      ))}
    </div>
  );
}

import { useRouter } from "next/router";

const Home = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const setGlobalState = useSetGlobalState();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim() && name.trim()) {
      if (setGlobalState) {
        setGlobalState({ email, name });
        // Persist to localStorage for reloads
        localStorage.setItem("astrochat-user", JSON.stringify({ email, name }));
      }
      router.push("/chat");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <div className={styles.container}>
      <StarryBackground />
      <div className={styles.center}>
        <h1 className={styles.title}>✨ Astro Chat ✨</h1>
        <p className={styles.subtitle}>
          Welcome to Astro Chat! Connect with others and share your cosmic
          insights under a starry sky.
        </p>
        <div className={styles.card}>
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <h2 className={styles.cardTitle}>
                Enter your email and name to begin your cosmic journey:
              </h2>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Your Email"
                style={{
                  padding: "0.7rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid #7e57c2",
                  fontSize: "1.1rem",
                  marginBottom: "1rem",
                  width: "100%",
                  boxSizing: "border-box",
                  background: "#181830",
                  color: "#ffd54f",
                }}
                required
                pattern="^[^@\s]+@[^@\s]+\.[^@\s]+$"
                title="Please enter a valid email address."
              />
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Your Name"
                style={{
                  padding: "0.7rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid #7e57c2",
                  fontSize: "1.1rem",
                  marginBottom: "1rem",
                  width: "100%",
                  boxSizing: "border-box",
                  background: "#181830",
                  color: "#ffd54f",
                }}
                required
              />
              <button
                type="submit"
                style={{
                  padding: "0.7rem 2rem",
                  borderRadius: "8px",
                  border: "none",
                  background:
                    "linear-gradient(90deg, #7e57c2 0%, #ffd54f 100%)",
                  color: "#181830",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(126, 87, 194, 0.2)",
                }}
              >
                Enter Chat Room
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Home;
