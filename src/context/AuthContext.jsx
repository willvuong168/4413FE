import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

/**
 * AuthContext
 *
 * Provides user authentication state and actions.
 */
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Initialize user from localStorage if available
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("authUser");
      return stored ? JSON.parse(stored) : null;
    } catch (err) {
      console.error("Failed to parse authUser from localStorage", err);
      return null;
    }
  });

  // Sync auth headers and localStorage when user changes
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (user && token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("authUser", JSON.stringify(user));
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("authUser");
    }
  }, [user]);

  // Login action: store token and set user
  const login = (userData, token) => {
    localStorage.setItem("authToken", token);
    setUser(userData);
  };

  // Logout action: clear token and user
  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
