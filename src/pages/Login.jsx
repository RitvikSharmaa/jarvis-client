import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Key, 
  Eye, 
  EyeOff, 
  LogIn,
  Cpu,
  Sparkles,
  Shield
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/api";
import { ENDPOINTS } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post(ENDPOINTS.LOGIN, formData);

      if (!res.data || !res.data.token) {
        throw new Error("Invalid server response");
      }

      const token = res.data.token;

      // AuthContext.login will decode & persist token (localStorage)
      login(token);

      toast.success(
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-green-400" />
          <span>Welcome to JARVIS AI, {formData.name || formData.username}! 🚀</span>
        </div>,
        {
          className: 'jarvis-toast',
          duration: 4000,
        }
      );
      navigate("/chat");
    } catch (err) {
      console.error("Login error:", err);
      toast.error(
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-red-400" />
          <span>Access denied: Invalid credentials</span>
        </div>,
        {
          className: 'jarvis-toast',
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { 
      name: "name", 
      placeholder: "Full Name", 
      icon: User,
      type: "text"
    },
    { 
      name: "username", 
      placeholder: "Username", 
      icon: User,
      type: "text"
    },
    { 
      name: "email", 
      placeholder: "Email Address", 
      icon: Mail,
      type: "email"
    },
    { 
      name: "password", 
      placeholder: "Password", 
      icon: Key,
      type: showPassword ? "text" : "password"
    },
  ];

  return (
    <div className="min-h-screen  flex items-center justify-center p-6">
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: 20 + Math.random() * 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="jarvis-glass rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden border border-cyan-500/30"
      >
        {/* Header Section */}
        <div className="jarvis-gradient-bg p-8 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <Cpu className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-white mb-2"
          >
            JARVIS AI
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-cyan-100/80"
          >
            Advanced RAG - based AI Assistant System
          </motion.p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-4">
            <AnimatePresence>
              {inputFields.map((field, index) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="relative"
                >
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 z-10">
                    <field.icon className="w-5 h-5" />
                  </div>
                  
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="jarvis-input w-full pl-12 pr-4 py-4 text-cyan-100 placeholder-cyan-300/60 transition-all duration-300 focus:border-cyan-400 focus:scale-[1.02]"
                    required
                  />

                  {/* Password visibility toggle */}
                  {field.name === "password" && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Login Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            className={`w-full mt-6 py-4 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group ${
              loading
                ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                : 'jarvis-gradient-button text-white shadow-lg'
            }`}
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-2"
                >
                  <div className="flex space-x-1">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-white rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                  <span>Initializing System...</span>
                </motion.div>
              ) : (
                <motion.div
                  key="login"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Access JARVIS AI</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hover effect */}
            {!loading && (
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-400/20 to-cyan-500/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            )}
          </motion.button>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-cyan-300/60 text-sm">
              <Shield className="w-4 h-4" />
              <span>Secure authentication required for system access</span>
            </div>
          </motion.div>
        </form>

        {/* Footer */}
        <div className="jarvis-glass-light border-t border-cyan-500/20 p-4 text-center">
          <p className="text-cyan-300/40 text-sm">
            JARVIS AI System v2.0 • Advanced Support Platform
          </p>
        </div>
      </motion.div>
    </div>
  );
}