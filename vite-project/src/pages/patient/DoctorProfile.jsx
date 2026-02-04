import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doctorAPI, reviewAPI } from "../../api/api";
import { useTheme } from "../../context/ThemeContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function DoctorProfile() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const docRes = await doctorAPI.getDoctorById(doctorId);
        setDoctor(docRes.data.doctor || docRes.data);

        const revRes = await reviewAPI.getReviewsByDoctor(doctorId);
        setReviews(revRes.data.reviews || revRes.data || []);
        setError("");
      } catch (err) {
        setError("Failed to load doctor profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [doctorId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 dark:border-purple-400"></div>
            <p className="text-gray-700 dark:text-gray-300 mt-4 text-lg font-medium">Loading doctor profile...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-12">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl dark:shadow-gray-900/70 max-w-md w-full text-center border border-gray-200 dark:border-gray-700">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Error Loading Profile</h2>
            <p className="text-red-600 dark:text-red-400 text-lg mb-6">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-bold"
            >
              ← Go Back
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const renderStars = (rating) => {
    return "⭐".repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? "✨" : "");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 px-4 py-2 bg-white dark:bg-gray-800 border-2 border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white transition font-semibold shadow-md dark:shadow-gray-900/50"
          >
            ← Back
          </button>

          {/* Doctor Header Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl dark:shadow-gray-900/70 p-8 mb-8 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Doctor Info */}
              <div className="md:col-span-2">
                <div className="mb-6">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-3">
                    👨‍⚕️ Dr. {doctor?.name}
                  </h1>
                  <p className="text-2xl text-purple-600 dark:text-purple-400 font-semibold mb-4">
                    {doctor?.specialization}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-5 rounded-xl border-2 border-blue-200 dark:border-blue-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">🎫 License Number</p>
                    <p className="font-bold text-gray-800 dark:text-white text-lg">
                      {doctor?.license_number || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-5 rounded-xl border-2 border-green-200 dark:border-green-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">💼 Experience</p>
                    <p className="font-bold text-gray-800 dark:text-white text-lg">
                      {doctor?.experience_years || 0} years
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                    📝 About
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {doctor?.bio || "Experienced and dedicated healthcare professional committed to providing quality patient care."}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                    📞 Contact Information
                  </h3>
                  <div className="space-y-2 text-gray-600 dark:text-gray-300">
                    <p>
                      <strong className="text-gray-800 dark:text-white">📧 Email:</strong> {doctor?.email || "N/A"}
                    </p>
                    <p>
                      <strong className="text-gray-800 dark:text-white">📱 Phone:</strong> {doctor?.phone || "N/A"}
                    </p>
                    <p className="flex items-center gap-2">
                      <strong className="text-gray-800 dark:text-white">🟢 Status:</strong>
                      <span
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                          doctor?.availability_status === "available"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-700"
                            : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-700"
                        }`}
                      >
                        {doctor?.availability_status === "available"
                          ? "✅ Available"
                          : "❌ Unavailable"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Rating & CTA */}
              <div>
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 rounded-xl p-6 text-white mb-4 shadow-lg">
                  <p className="text-sm opacity-90 mb-2">⭐ Overall Rating</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-5xl font-bold">{averageRating}</span>
                    <span className="text-3xl">{renderStars(averageRating)}</span>
                  </div>
                  <p className="text-sm opacity-90">
                    Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl p-5 mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">💰 Consultation Fee</p>
                  <p className="text-4xl font-bold text-gray-800 dark:text-white">
                    ${doctor?.consultation_fee || 0}
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/patient/book/${doctorId}`)}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 text-white rounded-lg font-bold hover:shadow-xl hover:scale-105 transition-all duration-200 mb-3"
                >
                  📅 Book Appointment
                </button>

                <button
                  onClick={() => navigate("/patient/browse-doctors")}
                  className="w-full py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  🔍 Browse More Doctors
                </button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl dark:shadow-gray-900/70 p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              ⭐ Patient Reviews ({reviews.length})
            </h2>

            {reviews.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No reviews yet. Be the first to review this doctor!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review, idx) => (
                  <div
                    key={review.id || idx}
                    className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white text-lg">
                          👤 {review.patient_name || "Anonymous"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          📅 {new Date(review.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-lg border border-yellow-200 dark:border-yellow-700">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">
                            {renderStars(review.rating)}
                          </span>
                          <span className="font-bold text-gray-800 dark:text-white text-lg">
                            {review.rating}/5
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{review.review_text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(`/patient/book/${doctorId}`)}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 text-white rounded-lg font-bold hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              📅 Book Appointment Now
            </button>
            <button
              onClick={() => navigate("/patient/dashboard")}
              className="px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
            >
              🏠 Back to Dashboard
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
