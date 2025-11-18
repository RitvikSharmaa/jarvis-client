import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  UserCircle,
  Shield,
  Key
} from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  const userDetails = [
    { label: "Full Name", value: user?.name, icon: UserCircle },
    { label: "Username", value: user?.username, icon: User },
    { label: "Email Address", value: user?.email, icon: Mail },
    { label: "User ID", value: user?.username, icon: Key },
  ];

  return (
    <div className="min-h-screen p-6">
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
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

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl relative"
          >
            <User className="w-12 h-12 text-white" />
            
            {/* Orbital Rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 border-2 border-cyan-400/30 rounded-3xl"
            />
          </motion.div>
          
          <h1 className="text-4xl font-bold jarvis-gradient-text mb-2">
            User Profile
          </h1>
          <p className="text-cyan-300/60 text-lg">
            JARVIS AI System User Information
          </p>
        </motion.div>

        {user ? (
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            {/* User Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="jarvis-glass rounded-2xl p-8 border border-cyan-500/20"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <UserCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-cyan-100">User Information</h2>
                  <p className="text-cyan-300/60">Account details and identification</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userDetails.map((detail, index) => {
                  const Icon = detail.icon;
                  return (
                    <motion.div
                      key={detail.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-cyan-500/5 to-blue-500/5 border border-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300 group"
                    >
                      <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                        <Icon className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-cyan-300/60 text-sm mb-1">{detail.label}</div>
                        <div className="text-cyan-100 font-medium text-lg truncate">
                          {detail.value || "Not available"}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Status Indicator */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 text-center"
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-semibold text-lg">Account Active</span>
                </div>
                <p className="text-cyan-300/60">
                  Your JARVIS AI account is fully operational
                </p>
              </motion.div>
            </motion.div>
          </div>
        ) : (
          // No User State
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="jarvis-glass rounded-2xl p-12 text-center border border-cyan-500/20"
          >
            <User className="w-16 h-16 text-cyan-400/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-cyan-100 mb-2">
              No Active Session
            </h3>
            <p className="text-cyan-300/60 mb-6">
              Please log in to access your profile
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = "/login"}
              className="jarvis-gradient-button px-6 py-3 rounded-xl"
            >
              Go to Login
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}