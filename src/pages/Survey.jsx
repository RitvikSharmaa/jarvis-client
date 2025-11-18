import { useState } from "react";
import api from "../api/api";
import { ENDPOINTS } from "../api/endpoints";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Survey() {
  const navigate = useNavigate();

  const [rating, setRating] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) return toast.error("Please select a rating");

    const ticketId = localStorage.getItem("ticket_id");

    try {
      await api.post(ENDPOINTS.SURVEY, {
        rating,
        notes: feedback,
        ticket_id: ticketId || null,
      });

      toast.success("Survey submitted!");
      localStorage.removeItem("ticket_id");

      setTimeout(() => navigate("/history"), 600);
    } catch (err) {
      toast.error("Failed to submit survey");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">
        Customer Survey
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block font-medium mb-2">Rate your experience:</label>

          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="border rounded-md p-2 w-64"
          >
            <option value="">Select...</option>
            <option value="5">⭐ 5 - Excellent</option>
            <option value="4">⭐ 4 - Good</option>
            <option value="3">⭐ 3 - Average</option>
            <option value="2">⭐ 2 - Poor</option>
            <option value="1">⭐ 1 - Terrible</option>
          </select>
        </div>

        <textarea
          placeholder="Additional feedback..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="border rounded-md p-3 w-full h-24"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Submit
        </button>

      </form>
    </div>
  );
}
