import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";

import Chat from "./pages/Chat";
import ChatSession from "./pages/ChatSession";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Survey from "./pages/Survey";
import History from "./pages/History";

import "./App.css";

// ----------------------
// 🔐 Enhanced Protected Route with Loading State
// ----------------------
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="jarvis-loading">
          <div className="loading-spinner"></div>
          <p className="text-cyan-400 mt-4 font-mono">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated, preserving intended destination
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// ----------------------
// 🔄 Public Route (redirect to chat if already logged in)
// ----------------------
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="jarvis-loading">
          <div className="loading-spinner"></div>
          <p className="text-cyan-400 mt-4 font-mono">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is already logged in, redirect to chat
  if (user) {
    return <Navigate to="/chat" replace />;
  }

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
            {/* Conditionally render Navbar - only show when user is authenticated */}
            <NavbarWrapper />
            
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
                {/* 🔐 LOGIN PAGE - Public route */}
                <Route 
                  path="/login" 
                  element={
                    <PublicRoute>
                      <div className="animate-fadeIn">
                        <Login />
                      </div>
                    </PublicRoute>
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

                {/* 🎯 REDIRECT ROOT TO LOGIN */}
                <Route 
                  path="/" 
                  element={
                    <PublicRoute>
                      <Navigate to="/login" replace />
                    </PublicRoute>
                  } 
                />

                {/* 🎯 CATCH ALL - REDIRECT TO LOGIN */}
                <Route 
                  path="*" 
                  element={
                    <Navigate to="/login" replace />
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

// -------------------------------
// 🧭 Navbar Wrapper (only show when authenticated)
// -------------------------------
function NavbarWrapper() {
  const { user } = useAuth();
  const location = useLocation();

  // Don't show navbar on login page
  if (!user || location.pathname === '/login') {
    return null;
  }

  return <Navbar />;
}