import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, SkipForward, Sparkles, MessageSquare, Satellite } from "lucide-react";
import api from "../api/api";
import { ENDPOINTS } from "../api/endpoints";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function SurveyPopup({ onSkip }) {
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!rating) return toast.error("Please select a rating");

  setLoading(true);

  const ticketId = localStorage.getItem("ticket_id");

  try {
    console.log("📤 Sending survey data:", {
      rating,
      notes: feedback,
      ticket_id: ticketId || null,
    });

    console.log("🔗 Survey Endpoint URL:", ENDPOINTS.SURVEY);

    // Test if the endpoint is reachable
    const surveyUrl = ENDPOINTS.SURVEY;
    
    // If it's a relative URL, it will use the baseURL from axios config
    // If it's a full URL, it will override the baseURL
    const response = await api.post(surveyUrl, {
      rating: rating.toString(),
      notes: feedback,
      ticket_id: ticketId || null,
    });

    console.log("✅ Survey API Response:", response);

    toast.success("Thanks for your feedback!");

    sessionStorage.setItem('survey_submitted', 'true');
    
    // Clear ALL chat-related localStorage
    localStorage.removeItem("ticket_id");
    localStorage.removeItem("chat_id");
    localStorage.removeItem("chat_closed");

    console.log("✅ Survey completed - prevention flag set");
    
    navigate("/history");
  } catch (err) {
    console.error("❌ Survey submission error:", err);
    console.error("❌ Error response:", err.response);
    console.error("❌ Error status:", err.response?.status);
    console.error("❌ Error data:", err.response?.data);
    console.error("❌ Error config:", err.config);
    
    // More specific error messages
    if (err.response?.status === 404) {
      toast.error("Survey endpoint not found. Please check the API URL.");
    } else if (err.response?.status === 500) {
      toast.error("Server error. Please try again later.");
    } else if (err.code === 'NETWORK_ERROR' || err.message === 'Network Error') {
      toast.error("Network error. Please check your connection and CORS settings.");
    } else if (err.response?.status === 0) {
      toast.error("CORS error or network issue. Check backend configuration.");
    } else {
      toast.error(`Failed to submit survey: ${err.response?.data?.message || err.message}`);
    }
  } finally {
    setLoading(false);
  }
};



const handleSkip = () => {
  // 🔥 REMOVED: sessionStorage.setItem('survey_completed', 'true');
  
  // Clear ALL chat-related localStorage before navigating
  localStorage.removeItem("ticket_id");
  localStorage.removeItem("chat_id");
  localStorage.removeItem("chat_closed");

  console.log("✅ Survey skipped - navigating to history");
  
  toast(
    <div className="flex items-center gap-2">
      <Satellite className="w-4 h-4 text-cyan-400" />
      <span>Redirecting to mission archives...</span>
    </div>,
    {
      className: 'jarvis-toast',
      duration: 3000,
    }
  );
  
  setIsExiting(true);
  setTimeout(() => navigate("/history"), 500);
};

  const StarRating = () => (
    <div className="flex justify-center gap-2 mb-6">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className="relative"
        >
          <motion.div
            animate={{
              scale: (hoverRating >= star || rating >= star) ? [1, 1.1, 1] : 1,
              rotate: (hoverRating >= star && !rating) ? [0, -10, 10, 0] : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <Star
              className={`w-10 h-10 transition-all duration-300 ${
                (hoverRating >= star || rating >= star)
                  ? "fill-yellow-400 text-yellow-400 drop-shadow-lg"
                  : "text-gray-400 hover:text-yellow-300"
              }`}
            />
          </motion.div>
          
          {/* Glow effect for active stars */}
          {(hoverRating >= star || rating >= star) && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 bg-yellow-400/20 rounded-full blur-sm"
            />
          )}
        </motion.button>
      ))}
    </div>
  );

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 jarvis-glass flex items-center justify-center z-50 p-4"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 animate-matrix" />
          
          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30"
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

          {/* Survey Card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="jarvis-glass border border-cyan-500/30 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden"
          >
            {/* Header */}
            <div className="jarvis-gradient-bg p-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <MessageSquare className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Mission Complete!
              </h2>
              <p className="text-cyan-100/80">
                Rate your JARVIS AI experience
              </p>
            </div>

            {/* Content */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Star Rating */}
                <div>
                  <label className="block text-cyan-100 font-medium mb-4 text-center text-lg">
                    How was your mission performance?
                  </label>
                  <StarRating />
                  
                  {/* Rating Labels */}
                  <div className="flex justify-between text-cyan-300/60 text-sm px-2">
                    <span>Needs Work</span>
                    <span>Excellent</span>
                  </div>
                </div>

                {/* Feedback Textarea */}
                <div>
                  <label className="block text-cyan-100 font-medium mb-3">
                    Mission Debrief (Optional)
                  </label>
                  <motion.textarea
                    whileFocus={{ scale: 1.02 }}
                    placeholder="Share your thoughts on the AI assistance, response quality, or suggestions for improvement..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="jarvis-input w-full h-32 resize-none transition-all duration-300"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading || !rating}
                  whileHover={(!loading && rating) ? { scale: 1.02 } : {}}
                  whileTap={(!loading && rating) ? { scale: 0.98 } : {}}
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group ${
                    loading || !rating
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
                        <span>Transmitting Feedback...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="submit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <Send className="w-5 h-5" />
                        <span>Submit Mission Report</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Hover effect */}
                  {!loading && rating && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-400/20 to-cyan-500/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  )}
                </motion.button>
              </form>

              {/* Skip Button */}
              <motion.button
                onClick={handleSkip}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full mt-4 py-3 rounded-xl border transition-all duration-300 flex items-center justify-center gap-2 ${
                  loading
                    ? 'text-gray-500 border-gray-600/50 cursor-not-allowed'
                    : 'text-cyan-300/70 border-cyan-500/30 hover:border-cyan-400/50 hover:text-cyan-300'
                }`}
              >
                <SkipForward className="w-4 h-4" />
                <span>Skip Debrief</span>
              </motion.button>
            </div>

            {/* Footer */}
            <div className="jarvis-glass-light border-t border-cyan-500/20 p-4 text-center">
              <p className="text-cyan-300/40 text-sm">
                Your feedback helps improve JARVIS AI systems
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}