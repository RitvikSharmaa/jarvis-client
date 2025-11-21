import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  // 🔥 Restore user on refresh with session timeout check
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const lastActivity = localStorage.getItem("lastActivity");
    const currentChatId = localStorage.getItem("chat_id");
    
    if (token) {
      try {
        // Check if session expired (10 minutes = 600000 ms)
        if (lastActivity && Date.now() - parseInt(lastActivity) > 600000) {
          console.log("🕒 Session expired - clearing data");
          localStorage.removeItem("authToken");
          localStorage.removeItem("chat_id");
          localStorage.removeItem("lastActivity");
          setUser(null);
        } else {
          const decoded = jwtDecode(token);
          setUser(decoded);
          
          // Update last activity time
          localStorage.setItem("lastActivity", Date.now().toString());
          
          // Check if we need to close the existing chat due to timeout
          if (currentChatId && lastActivity && Date.now() - parseInt(lastActivity) > 600000) {
            console.log("🕒 Chat session expired - closing chat");
            closeExpiredChat(currentChatId);
          }
        }
      } catch (err) {
        console.error("Invalid token in localStorage", err);
        localStorage.removeItem("authToken");
        localStorage.removeItem("chat_id");
        localStorage.removeItem("lastActivity");
        setUser(null);
      }
    } else {
      setUser(null);
    }
    
    setLoading(false);
  }, []);

  // 🔥 Close expired chat session
  const closeExpiredChat = async (chatId) => {
    try {
      await supabase
        .from("chats")
        .update({ status: "closed" })
        .eq("id", chatId);
      console.log("✅ Expired chat closed:", chatId);
    } catch (error) {
      console.error("❌ Failed to close expired chat:", error);
    }
  };

  // 🔥 Login handler
  const login = (token) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("lastActivity", Date.now().toString());
    const decoded = jwtDecode(token);
    setUser(decoded);
  };

  // 🔥 Enhanced Logout handler with chat cleanup
  const logout = async () => {
    const currentChatId = localStorage.getItem("chat_id");
    
    // Close any active chat before logging out
    if (currentChatId) {
      try {
        console.log("🔒 Closing active chat before logout:", currentChatId);
        await supabase
          .from("chats")
          .update({ status: "closed" })
          .eq("id", currentChatId);
        
        console.log("✅ Chat closed successfully");
      } catch (error) {
        console.error("❌ Failed to close chat on logout:", error);
      }
    }

    // Clear local storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("chat_id");
    localStorage.removeItem("lastActivity");
    setUser(null);
    
    console.log("🚪 User logged out successfully");
  };

  // 🔥 Update activity timestamp (call this on user interactions)
  const updateActivity = () => {
    if (user) {
      localStorage.setItem("lastActivity", Date.now().toString());
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateActivity }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};