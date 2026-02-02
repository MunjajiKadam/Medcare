import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { reviewAPI } from "../../api/api";

export default function Reviews() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [filterRating, setFilterRating] = useState("all");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      console.log("📤 [ADMIN REVIEWS] Fetching reviews from API...");
      const response = await reviewAPI.getReviews();
      console.log("✅ [ADMIN REVIEWS] Reviews received from backend:", response.data);
      setReviews(response.data.reviews || response.data || []);
    } catch (error) {
      console.error("❌ [ADMIN REVIEWS] Error loading reviews:", error);
      setMessage("Error: " + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id) => {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        console.log(`📤 [ADMIN REVIEWS] Deleting review ID: ${id}`);
        await reviewAPI.deleteReview(id);
        console.log("✅ [ADMIN REVIEWS] Review deleted successfully");
        setMessage("✓ Review deleted!");
        fetchReviews();
      } catch (error) {
        console.error("❌ [ADMIN REVIEWS] Error deleting review:", error);
        setMessage("✗ Error: " + error.response?.data?.message);
      }
    }
  };

  const filteredReviews = filterRating === "all"
    ? reviews
    : reviews.filter(r => r.rating === parseInt(filterRating));

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p>Loading reviews...</p></div>;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-white border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition font-semibold text-sm"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-dark mb-2">⭐ Doctor Reviews</h1>
        <p className="text-gray-600 mb-6">View and manage doctor reviews and ratings</p>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes("✓") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <label className="block text-sm font-semibold text-dark mb-2">Filter by Rating</label>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-6 text-center text-gray-500">
            No reviews found
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-accent hover:shadow-xl transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-dark">{review.doctor_name || "Unknown Doctor"}</h3>
                    <p className="text-gray-600 text-sm">Reviewed by: {review.patient_name || "Anonymous"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl">{"⭐".repeat(review.rating || 0)}</p>
                    <p className="text-gray-500 text-sm">{review.rating || 0}/5</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{review.comment || "No comment provided"}</p>
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{new Date(review.created_at).toLocaleDateString()}</span>
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-gray-600 text-sm">
          Total Reviews: <span className="font-bold text-dark">{filteredReviews.length}</span>
        </div>
      </div>
    </div>
  );
}
