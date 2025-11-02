import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;
export const BASE_URL = API_URL;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      try {
        const decoded = jwtDecode(savedToken);
        const currentTime = Date.now() / 1000;

        if (decoded.exp && decoded.exp < currentTime) {
          localStorage.removeItem("token"); // expired token
        } else {
          setToken(savedToken);
          setUser({
            id: decoded.userID,
            email: decoded.email,
            name: decoded.name,
          });
        }
      } catch (err) {
        console.error("Invalid token in storage", err);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const signIn = async (email, password) => {
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign in failed");

      localStorage.setItem("token", data.token);
      setToken(data.token);

      const decoded = jwtDecode(data.token);
      setUser({
        id: decoded.userID,
        email: decoded.email,
        name: decoded.name,
      });

      setIsLoading(false);
      return { success: true };
    } catch (err) {
      console.error("Sign in error:", err);
      setIsLoading(false);
      return { success: false, message: err.message };
    }
  };

  const signUp = async (name, email, password) => {
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) return { success: false, message: data.error || "Signup failed" };

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Server error" };
    }
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
