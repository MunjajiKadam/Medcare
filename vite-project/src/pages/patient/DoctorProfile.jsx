import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doctorAPI, reviewAPI } from "../../api/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function DoctorProfile() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading doctor profile...</p>
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go Back
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
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            ← Back
          </button>

          {/* Doctor Header Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Doctor Info */}
              <div className="md:col-span-2">
                <div className="mb-4">
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    Dr. {doctor?.name}
                  </h1>
                  <p className="text-2xl text-blue-600 font-semibold mb-4">
                    {doctor?.specialization}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">License Number</p>
                    <p className="font-bold text-gray-800">
                      {doctor?.license_number || "N/A"}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-bold text-gray-800">
                      {doctor?.experience_years || 0} years
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    About
                  </h3>
                  <p className="text-gray-600">
                    {doctor?.bio || "Experienced and dedicated healthcare professional committed to providing quality patient care."}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Contact Information
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    <p>
                      <strong>Email:</strong> {doctor?.email || "N/A"}
                    </p>
                    <p>
                      <strong>Phone:</strong> {doctor?.phone || "N/A"}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          doctor?.availability_status === "available"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {doctor?.availability_status === "available"
                          ? "Available"
                          : "Unavailable"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Rating & CTA */}
              <div>
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white mb-4">
                  <p className="text-sm opacity-90 mb-2">Overall Rating</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-4xl font-bold">{averageRating}</span>
                    <span className="text-2xl">{renderStars(averageRating)}</span>
                  </div>
                  <p className="text-sm opacity-90">
                    Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-1">Consultation Fee</p>
                  <p className="text-3xl font-bold text-gray-800">
                    ${doctor?.consultation_fee || 0}
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/patient/book/${doctorId}`)}
                  className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition mb-2"
                >
                  📅 Book Appointment
                </button>

                <button
                  onClick={() => navigate("/patient/browse-doctors")}
                  className="w-full py-3 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300 transition"
                >
                  🔍 Browse More Doctors
                </button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Patient Reviews ({reviews.length})
            </h2>

            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  No reviews yet. Be the first to review this doctor!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review, idx) => (
                  <div
                    key={review.id || idx}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {review.patient_name || "Anonymous"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(review.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-xl">
                            {renderStars(review.rating)}
                          </span>
                          <span className="font-bold text-gray-800">
                            {review.rating}/5
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.review_text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4 justify-center">
            <button
              onClick={() => navigate(`/patient/book/${doctorId}`)}
              className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition"
            >
              📅 Book Appointment Now
            </button>
            <button
              onClick={() => navigate("/patient/dashboard")}
              className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300 transition"
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
