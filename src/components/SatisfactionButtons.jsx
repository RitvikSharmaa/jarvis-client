import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Sparkles, HelpCircle } from "lucide-react";
import { useState } from "react";

export default function SatisfactionButtons({ onSatisfaction }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSatisfaction = async (response) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setSelectedOption(response);

    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onSatisfaction(response);
    
    // Reset after animation
    setTimeout(() => {
      setIsSubmitting(false);
      setSelectedOption(null);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-3 p-4 jarvis-glass rounded-xl border border-cyan-500/20 max-w-md"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2 text-cyan-100"
      >
        <HelpCircle className="w-4 h-4 text-cyan-400" />
        <span className="text-sm font-medium">Was this response helpful?</span>
      </motion.div>

      {/* Buttons Container */}
      <div className="flex gap-3">
        {/* Yes Button */}
        <motion.button
          onClick={() => handleSatisfaction("yes")}
          disabled={isSubmitting}
          whileHover={{ scale: selectedOption ? 1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border transition-all duration-300 group overflow-hidden ${
            selectedOption === "yes"
              ? "bg-green-500/20 border-green-400/50 text-green-400 shadow-lg"
              : selectedOption
              ? "opacity-50 cursor-not-allowed border-gray-600/50 text-gray-400"
              : "bg-green-500/10 border-green-400/30 text-green-300 hover:bg-green-500/20 hover:border-green-400/50 hover:shadow-lg"
          }`}
        >
          <AnimatePresence mode="wait">
            {selectedOption === "yes" ? (
              <motion.div
                key="yes-active"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Confirmed</span>
              </motion.div>
            ) : (
              <motion.div
                key="yes-default"
                initial={{ scale: 1 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
<div className="flex flex-col text-sm font-medium">
  <span>Satisfied</span>
  <span className="text-xs opacity-70">(Close chat)</span>
</div>              </motion.div>
            )}
          </AnimatePresence>

          {/* Active state glow */}
          {selectedOption === "yes" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-green-500/20 rounded-lg"
            />
          )}

          {/* Hover shimmer effect */}
          {!selectedOption && (
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-400/10 to-green-500/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          )}

          {/* Success confirmation */}
          {selectedOption === "yes" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1"
            >
              <div className="bg-green-500 text-white p-1 rounded-full">
                <Sparkles className="w-2 h-2" />
              </div>
            </motion.div>
          )}
        </motion.button>

        {/* No Button */}
        <motion.button
          onClick={() => handleSatisfaction("no")}
          disabled={isSubmitting}
          whileHover={{ scale: selectedOption ? 1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border transition-all duration-300 group overflow-hidden ${
            selectedOption === "no"
              ? "bg-red-500/20 border-red-400/50 text-red-400 shadow-lg"
              : selectedOption
              ? "opacity-50 cursor-not-allowed border-gray-600/50 text-gray-400"
              : "bg-red-500/10 border-red-400/30 text-red-300 hover:bg-red-500/20 hover:border-red-400/50 hover:shadow-lg"
          }`}
        >
          <AnimatePresence mode="wait">
            {selectedOption === "no" ? (
              <motion.div
                key="no-active"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Escalating</span>
              </motion.div>
            ) : (
              <motion.div
                key="no-default"
                initial={{ scale: 1 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Need Help</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active state glow */}
          {selectedOption === "no" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-red-500/20 rounded-lg"
            />
          )}

          {/* Hover shimmer effect */}
          {!selectedOption && (
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-400/10 to-red-500/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          )}

          {/* Processing indicator */}
          {selectedOption === "no" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1"
            >
              <div className="bg-red-500 text-white p-1 rounded-full">
                <Sparkles className="w-2 h-2" />
              </div>
            </motion.div>
          )}
        </motion.button>
      </div>

      {/* Loading State */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-center gap-2 text-cyan-300/60 text-xs"
          >
            <div className="flex space-x-1">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
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
            <span>
              {selectedOption === "yes" 
                ? "Recording positive feedback..." 
                : "Initiating support escalation..."}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-cyan-300/40 text-xs text-center"
      >
        Your feedback helps improve JARVIS AI assistance
      </motion.div>
    </motion.div>
  );
}