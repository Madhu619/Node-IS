import React, { createContext, useContext, useState, ReactNode } from "react";

interface GlobalState {
  email?: string;
  name?: string;
}

const GlobalStateContext = createContext<GlobalState | undefined>(undefined);
const GlobalStateUpdateContext = createContext<
  ((state: GlobalState) => void) | undefined
>(undefined);

export const useGlobalState = () => useContext(GlobalStateContext);
export const useSetGlobalState = () => useContext(GlobalStateUpdateContext);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GlobalState | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Initialize from localStorage and fetch user from backend
  React.useEffect(() => {
    const fetchUser = async (email: string, name: string) => {
      try {
        const res = await fetch("http://localhost:4000/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name }),
        });
        if (res.ok) {
          const user = await res.json();
          console.log("Fetched/created user from backend:", user);
          setState({ email: user.email, name: user.name });
        } else {
          console.log(
            "Backend did not return user, fallback to local:",
            email,
            name
          );
          setState({ email, name }); // fallback
        }
      } catch (err) {
        console.log("Error fetching user from backend:", err);
        setState({ email, name });
      }
      setLoading(false);
    };

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("astrochat-user");
      if (stored) {
        const { email, name } = JSON.parse(stored);
        console.log("Loaded from localStorage:", { email, name });
        if (email && name) {
          fetchUser(email, name);
        } else {
          setState({});
          setLoading(false);
        }
      } else {
        setState({});
        setLoading(false);
      }
    }
  }, []);

  // Persist to localStorage on change
  React.useEffect(() => {
    if (state && state.email && state.name) {
      localStorage.setItem("astrochat-user", JSON.stringify(state));
      console.log("Persisted to localStorage:", state);
    }
    console.log("GlobalState value:", state);
  }, [state]);

  if (loading || state === null)
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <span>Loading user profile...</span>
      </div>
    );

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalStateUpdateContext.Provider value={setState}>
        {children}
      </GlobalStateUpdateContext.Provider>
    </GlobalStateContext.Provider>
  );
};
