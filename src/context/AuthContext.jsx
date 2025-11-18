import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
const [user, setUser] = useState(undefined);

  // 🔥 Restore user on refresh
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token in localStorage", err);
        localStorage.removeItem("authToken");
      }
    }
  }, []);

  // 🔥 Login handler (called after API login)
  const login = (token) => {
    localStorage.setItem("authToken", token);
    const decoded = jwtDecode(token);
    setUser(decoded);
  };

  // 🔥 Logout handler
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("chat_id");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
