import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doctorAPI } from "../../api/api";
import { useAuth } from "../../Authcontext/AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Reviews() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalReviews: 0, avgRating: 0, ratingBreakdown: {} });
  const [doctorId, setDoctorId] = useState(null);

  useEffect(() => {
    fetchDoctorIdAndReviews();
  }, []);

  const fetchDoctorIdAndReviews = async () => {
    try {
      setLoading(true);
      console.log("📤 [DOCTOR REVIEWS] Fetching doctor profile...");
      
      // Get doctor profile to get doctor ID
      const profileRes = await doctorAPI.getProfile();
      console.log("✅ [DOCTOR REVIEWS] Doctor profile received:", profileRes.data);
      const docId = profileRes.data.id;
      setDoctorId(docId);
      
      // Fetch reviews for this doctor
      console.log("📤 [DOCTOR REVIEWS] Fetching reviews for doctor ID:", docId);
      const reviewsRes = await doctorAPI.getDoctorReviews(docId);
      console.log("✅ [DOCTOR REVIEWS] Reviews received from backend:", reviewsRes.data);
      
      const reviewsData = reviewsRes.data.reviews || reviewsRes.data || [];
      setReviews(reviewsData);
      
      // Calculate stats
      if (reviewsData.length > 0) {
        const avgRating = (reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length).toFixed(1);
        setStats({
          totalReviews: reviewsData.length,
          avgRating: avgRating,
          ratingBreakdown: {
            5: reviewsData.filter(r => r.rating === 5).length,
            4: reviewsData.filter(r => r.rating === 4).length,
            3: reviewsData.filter(r => r.rating === 3).length,
            2: reviewsData.filter(r => r.rating === 2).length,
            1: reviewsData.filter(r => r.rating === 1).length,
          }
        });
      } else {
        setStats({
          totalReviews: 0,
          avgRating: 0,
          ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        });
      }
    } catch (error) {
      console.error("❌ [DOCTOR REVIEWS] Error loading reviews:", error);
    } finally {
      setLoading(false);
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
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 px-4 py-2 bg-white border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition font-semibold text-sm"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold text-dark mb-2">⭐ Patient Reviews</h1>
          <p className="text-gray-600 mb-8">See what your patients are saying</p>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Average Rating */}
            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-600 mb-2">Average Rating</p>
              <div className="flex items-end gap-2">
                <p className="text-5xl font-bold text-accent">{stats.avgRating}</p>
                <p className="text-lg text-gray-600 mb-1">/ 5.0</p>
              </div>
              <div className="text-yellow-500 text-lg mt-2">
                {'⭐'.repeat(Math.round(stats.avgRating))}
              </div>
            </div>

            {/* Total Reviews */}
            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-600 mb-2">Total Reviews</p>
              <p className="text-5xl font-bold text-primary">{stats.totalReviews}</p>
              <p className="text-sm text-gray-600 mt-2">From verified patients</p>
            </div>

            {/* Rating Breakdown */}
            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-600 mb-4">Rating Breakdown</p>
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center gap-2 text-sm mb-2">
                  <span className="w-8 text-accent font-semibold">{rating}⭐</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${(stats.ratingBreakdown[rating] || 0) / stats.totalReviews * 100}%` }}
                    ></div>
                  </div>
                  <span className="w-6 text-right">{stats.ratingBreakdown[rating] || 0}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow text-center">
              <p className="text-gray-600 text-lg mb-2">📝 No reviews yet</p>
              <p className="text-gray-500 text-sm">Your patients haven't left any reviews yet.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-dark">{review.patient_name || 'Patient'}</h3>
                      <p className="text-sm text-gray-600">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500 text-lg">{'⭐'.repeat(review.rating)}</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">✓ Verified</span>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.review_text}</p>
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
