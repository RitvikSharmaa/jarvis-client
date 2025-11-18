import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Zap, Mic, Square } from "lucide-react";

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (disabled) return;
    if (!text.trim()) return;

    onSend(text);
    setText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Add voice recording functionality here
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="jarvis-glass border-t border-cyan-500/20 p-6"
    >
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          {/* Input Container */}
          <div className="relative flex items-center gap-3">
         

            {/* Main Input */}
            <div className="flex-1 relative">
              <motion.input
                disabled={disabled}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  disabled 
                    ? "🛑 Mission terminated. Session completed." 
                    : "🎯 Transmit your message to JARVIS..."
                }
                className="jarvis-input w-full pl-4 pr-12 py-4 text-white placeholder-cyan-300/60 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              />
              
              {/* Character Counter */}
              {text.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    text.length > 200 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-cyan-500/20 text-cyan-400'
                  }`}>
                    {text.length}/500
                  </div>
                </motion.div>
              )}
            </div>

            {/* Send Button */}
            <motion.button
              type="submit"
              disabled={disabled || !text.trim()}
              whileHover={!disabled && text.trim() ? { scale: 1.05 } : {}}
              whileTap={!disabled && text.trim() ? { scale: 0.95 } : {}}
              className={`relative p-4 rounded-xl font-semibold transition-all duration-300 overflow-hidden group ${
                disabled || !text.trim()
                  ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                  : 'jarvis-gradient-button text-white shadow-lg'
              }`}
            >
              <AnimatePresence mode="wait">
                {disabled ? (
                  <motion.div
                    key="disabled"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <Square className="w-5 h-5" />
                    <span>Terminated</span>
                  </motion.div>
                ) : !text.trim() ? (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <Zap className="w-5 h-5" />
                    <span>Standby</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="active"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>Transmit</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Active State Glow */}
              {!disabled && text.trim() && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-400/20 to-cyan-500/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              )}
            </motion.button>
          </div>

          {/* Recording Indicator */}
          <AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 flex items-center justify-center gap-3 text-red-400"
              >
                <div className="flex space-x-1">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-red-400 rounded-full"
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
                <span className="text-sm font-medium">Recording audio transmission...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

 
      </div>
    </motion.div>
  );
}