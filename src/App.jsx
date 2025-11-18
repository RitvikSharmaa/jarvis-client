import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";

import Chat from "./pages/Chat";
import ChatSession from "./pages/ChatSession";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Survey from "./pages/Survey";
import History from "./pages/History";

import "./App.css";

// ----------------------
// 🔐 Protect normal pages
// ----------------------
function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // If user not loaded yet, show nothing (prevents redirect flicker)
  if (user === undefined) return null;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}

// -------------------------------
// 🎯 Video Background Component
// -------------------------------
const VideoBackground = () => (
  <div className="video-background">
    <video
      autoPlay
      muted
      loop
      playsInline
      className="video-element"
    >
      <source src="/bg.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <div className="video-overlay"></div>
  </div>
);

// -------------------------------
// 🎯 Floating Particles Background
// -------------------------------
const FloatingParticles = () => (
  <div className="particles-container">
    {[...Array(15)].map((_, i) => (
      <div
        key={i}
        className="jarvis-particle"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 8}s`,
          animationDuration: `${8 + Math.random() * 12}s`,
          width: `${1 + Math.random() * 2}px`,
          height: `${1 + Math.random() * 2}px`,
          opacity: 0.1 + Math.random() * 0.2,
        }}
      />
    ))}
  </div>
);

// -------------------------------
// 🚀 Main App Component
// -------------------------------
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* 🌟 Video Background */}
        <VideoBackground />
        
        {/* 🌟 Futuristic Overlay Elements */}
        <div className="app-overlay">
          <FloatingParticles />
          
          {/* 🔮 Scanline Effect */}
          <div className="jarvis-scanline fixed inset-0 pointer-events-none z-0" />
          
          {/* 🎯 Main Content */}
          <div className="relative z-10">
            <Navbar />
            
            <Toaster 
              position="top-right" 
              toastOptions={{
                className: 'jarvis-toast',
                duration: 4000,
                style: {
                  background: 'rgba(15, 23, 42, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(34, 211, 238, 0.3)',
                  color: '#00ffff',
                  borderRadius: '12px',
                  padding: '16px',
                  fontSize: '14px',
                  fontWeight: '500',
                },
                success: {
                  iconTheme: {
                    primary: '#00ffff',
                    secondary: '#0f172a',
                  },
                },
                error: {
                  style: {
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#fecaca',
                  },
                },
              }}
            />

            <main className="jarvis-container">
              <Routes>
                {/* 🔐 LOGIN PAGE */}
                <Route 
                  path="/login" 
                  element={
                    <div className="animate-fadeIn">
                      <Login />
                    </div>
                  } 
                />

                {/* 🤖 ACTIVE LIVE CHAT */}
                <Route
                  path="/chat"
                  element={
                    <ProtectedRoute>
                      <div className="animate-slideIn">
                        <Chat />
                      </div>
                    </ProtectedRoute>
                  }
                />

                {/* 📜 PAST CHAT VIEW */}
                <Route
                  path="/chat/:id"
                  element={
                    <ProtectedRoute>
                      <div className="animate-slideIn">
                        <ChatSession />
                      </div>
                    </ProtectedRoute>
                  }
                />

                {/* 📊 CHAT HISTORY */}
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <div className="animate-slideIn">
                        <History />
                      </div>
                    </ProtectedRoute>
                  }
                />

                {/* 👤 PROFILE */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <div className="animate-slideIn">
                        <Profile />
                      </div>
                    </ProtectedRoute>
                  }
                />

                {/* 📝 SURVEY */}
                <Route
                  path="/survey"
                  element={
                    <ProtectedRoute>
                      <div className="animate-slideIn">
                        <Survey />
                      </div>
                    </ProtectedRoute>
                  }
                />

                {/* 🎯 REDIRECT TO HISTORY */}
                <Route 
                  path="*" 
                  element={
                    <div className="animate-fadeIn">
                      <Navigate to="/login" replace />
                    </div>
                  } 
                />
              </Routes>
            </main>
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}