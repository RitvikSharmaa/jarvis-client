import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  LogOut, 
  MessageSquare, 
  History, 
  User, 
  Home,
  Zap,
  Satellite
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleChatClick = () => {
    // 🔥 Clear prevention flag when manually navigating to chat
    sessionStorage.removeItem('survey_completed');
  };

  const handleLogout = () => {
    logout();
    // Add logout confirmation toast
  };

  const navItems = [
    { path: "/chat", label: "Chat", icon: MessageSquare, description: "Live AI Assistant" },
    { path: "/history", label: "History", icon: History, description: "Session Archives" },
    { path: "/profile", label: "Profile", icon: User, description: "User Configuration" },
  ];

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="jarvis-navbar sticky top-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo/Brand */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 group"
        >
          <motion.div
            animate={{ 
              rotateY: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotateY: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity }
            }}
            className="relative"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            {/* Animated orbit */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 border-2 border-cyan-400/30 rounded-xl"
            />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold jarvis-gradient-text">JARVIS AI</h1>
            <p className="text-cyan-300/60 text-xs">Advanced Support System</p>
          </div>
        </motion.div>

        {/* Navigation Links */}
        <div className="flex items-center gap-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <NavLink
                  to={item.path}
                  onClick={item.path === "/chat" ? handleChatClick : undefined}
                  className="relative group"
                >
                  {({ isActive }) => (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 jarvis-nav-item ${
                        isActive ? "jarvis-nav-active" : ""
                      }`}
                    >
                      <Icon className={`w-4 h-4 transition-colors duration-300 ${
                        isActive ? "text-cyan-400" : "text-cyan-300/70"
                      }`} />
                      <span className="font-medium">{item.label}</span>
                      
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="navIndicator"
                          className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl -z-10"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}

                      {/* Hover tooltip */}
                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="jarvis-glass-light text-cyan-100 text-xs px-2 py-1 rounded-lg whitespace-nowrap border border-cyan-500/20">
                          {item.description}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </NavLink>
              </motion.div>
            );
          })}
        </div>

        {/* User Info & Logout */}
        <AnimatePresence>
          {user && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              {/* User Info */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 jarvis-glass-light px-3 py-2 rounded-lg border border-cyan-500/20"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-cyan-100 text-sm font-medium">{user.name}</p>
                  <p className="text-cyan-300/60 text-xs">@{user.username}</p>
                </div>
              </motion.div>

              {/* Logout Button */}
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 text-red-400 hover:from-red-500/20 hover:to-red-600/20 hover:border-red-400/50 transition-all duration-300"
                title="Logout from system"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-400/10 to-red-500/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Indicator Line */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </motion.nav>
  );
}