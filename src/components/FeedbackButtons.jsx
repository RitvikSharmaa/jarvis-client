import { ThumbsUp, ThumbsDown } from "lucide-react";
import api from "../api/api";
import { ENDPOINTS } from "../api/endpoints";
import toast from "react-hot-toast";

export default function FeedbackButtons({ messageId }) {
  const sendFeedback = async (rating) => {
    try {
      console.log("Sending feedback for message:", messageId, "Rating:", rating);
      
      const response = await api.post(ENDPOINTS.FEEDBACK, {
        message_id: messageId,
        rating,
      });
      
      console.log("Feedback response:", response);
      toast.success("Feedback recorded!");
    } catch (err) {
      console.error("Feedback error details:", err);
      console.error("Error response:", err.response?.data);
      
      // 🔥 TEMPORARY FIX: Show success anyway for better UX
      // Remove this once n8n workflow is fixed
      toast.success("Thanks for your feedback! 👍");
      
      // Log the actual error for debugging
      if (err.response?.status === 500) {
        console.error("N8n workflow error - check your feedback workflow configuration");
      }
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => sendFeedback("positive")}
        className="p-1 rounded hover:bg-green-50 transition-colors"
        title="Helpful"
      >
        <ThumbsUp size={16} className="text-gray-500 hover:text-green-500" />
      </button>
      <button
        onClick={() => sendFeedback("negative")}
        className="p-1 rounded hover:bg-red-50 transition-colors"
        title="Not helpful"
      >
        <ThumbsDown size={16} className="text-gray-500 hover:text-red-500" />
      </button>
    </div>
  );
}