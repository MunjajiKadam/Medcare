import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { reviewAPI } from "../../api/api";
import { useAuth } from "../../Authcontext/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Reviews() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme } = useTheme();
  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await logout();
      navigate("/admin/login");
    }
  };
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
      const response = await reviewAPI.getAllReviewsAdmin();
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
        await reviewAPI.deleteReviewAdmin(id);
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

  if (loading) return <div className="min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center"><p className="text-gray-700 dark:text-gray-300">Loading reviews...</p></div>;

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 p-6 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition font-semibold text-sm"
          >
            ← Back
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold text-sm flex items-center gap-2"
          >
            <span>🚪</span>
            Logout
          </button>
        </div>

        <h1 className="text-3xl font-bold text-dark dark:text-white mb-2">⭐ Doctor Reviews</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">View and manage doctor reviews and ratings</p>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes("✓") ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"}`}>
            {message}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <label className="block text-sm font-semibold text-dark dark:text-white mb-2">Filter by Rating</label>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-accent dark:bg-gray-700 dark:text-white"
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center text-gray-500 dark:text-gray-400">
            No reviews found
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-accent hover:shadow-xl transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-dark dark:text-white">{review.doctor_name || "Unknown Doctor"}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Reviewed by: {review.patient_name || "Anonymous"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl">{"⭐".repeat(review.rating || 0)}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{review.rating || 0}/5</p>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">{review.comment || "No comment provided"}</p>
                
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>{new Date(review.created_at).toLocaleDateString()}</span>
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-gray-600 dark:text-gray-400 text-sm">
          Total Reviews: <span className="font-bold text-dark dark:text-white">{filteredReviews.length}</span>
        </div>
      </div>
    </div>
  );
}
