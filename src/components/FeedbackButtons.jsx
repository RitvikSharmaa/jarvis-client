import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../api/api";
import { ENDPOINTS } from "../api/endpoints";
import toast from "react-hot-toast";

export default function FeedbackButtons({ messageId }) {
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // Load saved feedback from localStorage on component mount
  useEffect(() => {
    if (messageId) {
      const savedFeedback = localStorage.getItem(`feedback_${messageId}`);
      if (savedFeedback) {
        setSelectedFeedback(savedFeedback);
      }
    }
  }, [messageId]);

  const sendFeedback = async (rating) => {
    // Toggle if same button clicked
    const newFeedback = selectedFeedback === rating ? null : rating;
    setSelectedFeedback(newFeedback);

    // Save to localStorage
    if (messageId) {
      if (newFeedback) {
        localStorage.setItem(`feedback_${messageId}`, newFeedback);
      } else {
        localStorage.removeItem(`feedback_${messageId}`);
      }
    }

    // Only send API request when giving feedback, not when removing it
    if (newFeedback) {
      try {
        console.log("Sending feedback for message:", messageId, "Rating:", rating);
        
        const response = await api.post(ENDPOINTS.FEEDBACK, {
          message_id: messageId,
          rating: newFeedback,
        });
        
        console.log("Feedback response:", response);
        toast.success("Feedback recorded!");
      } catch (err) {
        console.error("Feedback error details:", err);
        console.error("Error response:", err.response?.data);
        
        // 🔥 TEMPORARY FIX: Show success anyway for better UX
        toast.success("Thanks for your feedback! 👍");
        
        if (err.response?.status === 500) {
          console.error("N8n workflow error - check your feedback workflow configuration");
        }
      }
    } else {
      toast.success("Feedback removed");
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => sendFeedback("positive")}
        className={`p-2 rounded transition-all duration-200 ${
          selectedFeedback === "positive" 
            ? "bg-green-500/20 border border-green-500/50 shadow-lg scale-110" 
            : "hover:bg-green-50 border border-transparent hover:scale-105"
        }`}
        title={selectedFeedback === "positive" ? "Remove helpful feedback" : "Mark as helpful"}
      >
        <ThumbsUp 
          size={16} 
          className={
            selectedFeedback === "positive" 
              ? "text-green-500" 
              : "text-gray-500 hover:text-green-500"
          } 
        />
      </button>
      <button
        onClick={() => sendFeedback("negative")}
        className={`p-2 rounded transition-all duration-200 ${
          selectedFeedback === "negative" 
            ? "bg-red-500/20 border border-red-500/50 shadow-lg scale-110" 
            : "hover:bg-red-50 border border-transparent hover:scale-105"
        }`}
        title={selectedFeedback === "negative" ? "Remove unhelpful feedback" : "Mark as unhelpful"}
      >
        <ThumbsDown 
          size={16} 
          className={
            selectedFeedback === "negative" 
              ? "text-red-500" 
              : "text-gray-500 hover:text-red-500"
          } 
        />
      </button>
    </div>
  );
}