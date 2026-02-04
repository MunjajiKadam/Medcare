import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { reviewAPI, doctorAPI } from "../../api/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Reviews() {
  const navigate = useNavigate();
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
      <div className="min-h-screen bg-background flex items-center justify-center"><p>Loading reviews...</p></div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-white border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition font-semibold text-sm"
        >
          ← Back
        </button>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-dark mb-2">⭐ My Reviews</h1>
            <p className="text-gray-600">Share your experience with doctors</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-accent text-white rounded-lg hover:opacity-90 font-semibold"
          >
            {showForm ? "Cancel" : "✍️ Write Review"}
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes("✓") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}

        {/* Review Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-dark mb-6">Write a Review</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Select Doctor</label>
                <select
                  name="doctor_id"
                  value={formData.doctor_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-accent"
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
                <label className="block text-sm font-semibold text-dark mb-2">Rating</label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      className={`text-4xl transition ${
                        formData.rating >= star ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">Rating: {formData.rating}/5</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Your Review</label>
                <textarea
                  name="review_text"
                  value={formData.review_text}
                  onChange={handleChange}
                  placeholder="Share your experience..."
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-accent text-white rounded-lg font-bold hover:opacity-90 transition"
              >
                Submit Review
              </button>
            </form>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <div className="text-5xl mb-4">⭐</div>
            <p className="text-gray-600 mb-4">No reviews yet</p>
            <p className="text-sm text-gray-500">Start sharing your experience by writing a review</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-400 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-dark">{review.doctor_name || "Doctor"}</h3>
                    <p className="text-sm text-gray-600">
                      📅 {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{"⭐".repeat(review.rating || 0)}</span>
                    <span className="text-lg font-bold text-accent">{review.rating}/5</span>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{review.review_text || "No review text"}</p>

                <button
                  onClick={() => deleteReview(review.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:opacity-90 text-sm font-semibold"
                >
                  Delete Review
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
