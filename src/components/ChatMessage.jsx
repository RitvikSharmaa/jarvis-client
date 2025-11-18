import { motion, AnimatePresence } from "framer-motion";
import { User, Sparkles, Cpu } from "lucide-react";
import { useState, useEffect } from "react";
import SatisfactionButtons from "./SatisfactionButtons";
import FeedbackButtons from "./FeedbackButtons";

export default function ChatMessage({ message, onSatisfaction, chatLocked }) {
  // Add safe defaults for message
  const safeMessage = message || {};
  const safeContent = safeMessage.content || "";
  
  const isUser = safeMessage.role === "user";
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(!isUser); // Only type for AI messages

  // Detect system / closing messages - safely
  const isClosingMessage =
    safeContent.toLowerCase().includes("chat has been closed") ||
    safeContent.toLowerCase().includes("ticket has been created") ||
    safeContent.toLowerCase().includes("successfully and the chat");

  // Conditions to show satisfaction buttons:
  const showSatisfaction =
    !isUser &&           // Only AI messages
    !chatLocked &&       // Hide when chat closed
    !isClosingMessage;   // Hide for "chat closed" messages

  // Conditions to show feedback buttons (thumbs up/down):
  const showFeedback =
    !isUser &&           // Only AI messages
    !chatLocked &&       // Hide when chat closed
    !isClosingMessage && // Hide for "chat closed" messages
    safeMessage.id;      // Ensure message has an ID

  // Ultra-fast typing animation effect
  useEffect(() => {
    if (isUser) {
      // For user messages, show immediately
      setDisplayedText(safeContent);
      return;
    }

    if (!isTyping) {
      setDisplayedText(safeContent);
      return;
    }

    if (currentIndex < safeContent.length) {
      const typingSpeed = 5; // Very fast - 5ms per character
      const chunkSize = Math.max(1, Math.floor(safeContent.length / 50)); // Type in chunks for speed
      
      const timeout = setTimeout(() => {
        const endIndex = Math.min(currentIndex + chunkSize, safeContent.length);
        setDisplayedText(safeContent.substring(0, endIndex));
        setCurrentIndex(endIndex);
      }, typingSpeed);

      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [currentIndex, isTyping, safeContent, isUser]);

  // Reset typing when message changes
  useEffect(() => {
    if (!isUser) {
      setDisplayedText("");
      setCurrentIndex(0);
      setIsTyping(true);
    } else {
      setDisplayedText(safeContent);
    }
  }, [safeContent, isUser]);

  // Don't render if message is invalid
  if (!safeMessage || typeof safeMessage !== 'object') {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}
    >
      {/* Message Container */}
      <div className={`flex gap-3 max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${
            isUser
              ? "bg-gradient-to-br from-cyan-500 to-blue-600 border-cyan-400/50"
              : "bg-gradient-to-br from-purple-500 to-indigo-600 border-purple-400/50"
          } shadow-lg`}
        >
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <motion.div
              animate={{ 
                rotateY: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotateY: { duration: 4, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
            >
              <Cpu className="w-5 h-5 text-white" />
            </motion.div>
          )}
        </motion.div>

        {/* Message Content */}
        <div className="flex flex-col gap-2">
          {/* Message Bubble */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`relative rounded-2xl p-4 message-bubble-hover ${
              isUser
                ? "jarvis-gradient-bg text-white rounded-br-none shadow-lg"
                : "jarvis-glass border border-cyan-500/30 text-cyan-100 rounded-bl-none shadow-lg"
            } ${isClosingMessage ? 'system-message-glow' : ''}`}
          >
            {/* User message decoration */}
            {isUser && (
              <div className="absolute -right-2 top-0 w-4 h-4 bg-gradient-to-br from-cyan-500 to-blue-600 clip-triangle" />
            )}
            
            {/* AI message decoration */}
            {!isUser && (
              <div className="absolute -left-2 top-0 w-4 h-4 bg-gradient-to-br from-purple-500 to-indigo-600 clip-triangle-left" />
            )}

            {/* Message Text with Ultra-Fast Typing Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05 }}
              className="leading-relaxed whitespace-pre-wrap font-mono tracking-tight"
            >
              <span className="text-shadow-tech">
                {displayedText}
              </span>
              
              {/* Fast blinking cursor for AI messages */}
              {isTyping && !isUser && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.4, repeat: Infinity }}
                  className="ml-0.5 text-cyan-400 font-bold"
                >
                  █
                </motion.span>
              )}
            </motion.div>

            {/* Special effects for closing messages */}
            {isClosingMessage && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2"
              >
                <div className="bg-green-500/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg font-mono tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  <span className="font-semibold">MISSION_COMPLETE</span>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Action Buttons Container */}
          <AnimatePresence>
            {(showSatisfaction || showFeedback) && !isTyping && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`flex justify-end gap-2 ${isUser ? "pr-12" : "pr-0"}`}
              >
                {/* Feedback buttons (thumbs up/down) */}
                {showFeedback && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <FeedbackButtons messageId={safeMessage.id} />
                  </motion.div>
                )}

                {/* Satisfaction buttons (Yes/No) */}
                {showSatisfaction && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    <SatisfactionButtons onSatisfaction={onSatisfaction} />
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Timestamp - Only show after typing completes */}
          <AnimatePresence>
            {(!isTyping || isUser) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`text-xs opacity-60 font-mono tracking-wide ${isUser ? "text-right pr-12" : "text-left pl-12"}`}
              >
                <span className="text-cyan-400/80">
                  {isUser ? "USER" : "JARVIS_AI"} • {new Date().toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                  }).replace(':', '')}H
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}