import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { reviewAPI, doctorAPI } from "../../api/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useTheme } from "../../context/ThemeContext";

export default function Reviews() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [reviews, setReviews] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    doctor_id: "",
    rating: 5,
    review_text: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("📤 [USER REVIEWS] Fetching user reviews from API...");
      const reviewsRes = await reviewAPI.getReviews();
      console.log("✅ [USER REVIEWS] Reviews received from backend:", reviewsRes.data);
      setReviews(reviewsRes.data.reviews || reviewsRes.data || []);

      console.log("📤 [USER REVIEWS] Fetching doctors from API...");
      const doctorsRes = await doctorAPI.getAllDoctors();
      console.log("✅ [USER REVIEWS] Doctors data received:", doctorsRes.data);
      setDoctors(doctorsRes.data.doctors || doctorsRes.data || []);
    } catch (error) {
      console.error("❌ [USER REVIEWS] Error loading data:", error);
      setMessage("Error loading data: " + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.doctor_id || !formData.review_text.trim()) {
      setMessage("Please select a doctor and add a review");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      console.log("📤 [USER REVIEWS] Submitting new review:", formData);
      await reviewAPI.createReview(formData);
      console.log("✅ [USER REVIEWS] Review submitted successfully");
      setMessage("✓ Review submitted successfully!");
      setFormData({ doctor_id: "", rating: 5, review_text: "" });
      setShowForm(false);
      fetchData();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("❌ [USER REVIEWS] Error submitting review:", error);
      setMessage("✗ Error: " + error.response?.data?.message);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const deleteReview = async (id) => {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        console.log(`📤 [USER REVIEWS] Deleting review ID: ${id}`);
        await reviewAPI.deleteReview(id);
        console.log("✅ [USER REVIEWS] Review deleted successfully");
        setMessage("✓ Review deleted!");
        fetchData();
        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        console.error("❌ [USER REVIEWS] Error deleting review:", error);
        setMessage("✗ Error: " + error.response?.data?.message);
        setTimeout(() => setMessage(""), 3000);
      }
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 dark:border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">Loading reviews...</p>
        </div>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-white dark:bg-gray-800 border-2 border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white transition font-semibold text-sm shadow-md dark:shadow-gray-900/50"
        >
          ← Back
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">⭐ My Reviews</h1>
            <p className="text-gray-600 dark:text-gray-400">Share your experience with doctors</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white rounded-lg hover:shadow-lg hover:scale-105 font-semibold transition-all duration-200 shadow-md"
          >
            {showForm ? "✖ Cancel" : "✍️ Write Review"}
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes("✓") ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
          }`}>
            {message}
          </div>
        )}

        {/* Review Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl dark:shadow-gray-900/70 mb-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">✍️ Write a Review</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">👨‍⚕️ Select Doctor</label>
                <select
                  name="doctor_id"
                  value={formData.doctor_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition"
                  required
                >
                  <option value="">Choose a doctor...</option>
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} - {doc.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">⭐ Rating</label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      className={`text-4xl transition-all duration-200 hover:scale-110 ${
                        formData.rating >= star ? "text-yellow-400 dark:text-yellow-300" : "text-gray-300 dark:text-gray-600"
                      }`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">Rating: {formData.rating}/5</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">💬 Your Review</label>
                <textarea
                  name="review_text"
                  value={formData.review_text}
                  onChange={handleChange}
                  placeholder="Share your experience..."
                  rows="5"
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition placeholder-gray-400 dark:placeholder-gray-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white rounded-lg font-bold hover:shadow-xl hover:scale-105 transition-all duration-200 shadow-md"
              >
                ✓ Submit Review
              </button>
            </form>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-12 rounded-xl shadow-lg dark:shadow-gray-900/70 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-6xl mb-4 animate-bounce">⭐</div>
            <p className="text-gray-700 dark:text-gray-300 mb-4 text-xl font-semibold">No reviews yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Start sharing your experience by writing a review</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:shadow-gray-900/70 border-l-4 border-yellow-400 dark:border-yellow-500 hover:shadow-2xl dark:hover:shadow-gray-900/80 hover:scale-[1.02] transition-all duration-300 border-t border-r border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">{review.doctor_name || "Doctor"}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      📅 {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-lg">
                    <span className="text-2xl">{"⭐".repeat(review.rating || 0)}</span>
                    <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{review.rating}/5</span>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">{review.review_text || "No review text"}</p>

                <button
                  onClick={() => deleteReview(review.id)}
                  className="px-5 py-2.5 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 hover:shadow-lg transition-all duration-200 text-sm font-semibold"
                >
                  🗑️ Delete Review
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    <Footer />
    </>
  );
}
