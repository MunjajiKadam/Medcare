import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doctorAPI } from "../../api/api";
import { useAuth } from "../../Authcontext/AuthContext";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    specialization: "",
    experience_years: "",
    consultation_fee: "",
    bio: "",
    availability_status: "available",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      console.log("📤 [DOCTOR PROFILE] Fetching doctor profile from API...");
      const response = await doctorAPI.getProfile();
      console.log("✅ [DOCTOR PROFILE] Doctor data received from backend:", response.data);
      if (response.data) {
        const doctorData = response.data;
        setProfile(doctorData);
        setFormData({
          specialization: doctorData.specialization || "",
          experience_years: doctorData.experience_years || "",
          consultation_fee: doctorData.consultation_fee || "",
          bio: doctorData.bio || "",
          availability_status: doctorData.availability_status || "available",
        });
      }
    } catch (error) {
      console.error("❌ [DOCTOR PROFILE] Error loading profile:", error);
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
    console.log("📤 [DOCTOR PROFILE] Updating doctor profile with data:", formData);
    // Add your update logic here
    setEditing(false);
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p>Loading profile...</p></div>;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-white border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition font-semibold text-sm"
        >
          ← Back
        </button>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-dark mb-2">👨‍⚕️ Doctor Profile</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="px-6 py-2 bg-accent text-white rounded-lg hover:opacity-90"
            >
              {editing ? "Cancel" : "✏️ Edit"}
            </button>
          </div>

          {profile ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Specialization */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-accent disabled:bg-gray-100"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Years of Experience</label>
                <input
                  type="number"
                  name="experience_years"
                  value={formData.experience_years}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-accent disabled:bg-gray-100"
                />
              </div>

              {/* Consultation Fee */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Consultation Fee ($)</label>
                <input
                  type="number"
                  name="consultation_fee"
                  value={formData.consultation_fee}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-accent disabled:bg-gray-100"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!editing}
                  rows="4"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-accent disabled:bg-gray-100"
                />
              </div>

              {/* Availability Status */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Availability</label>
                <select
                  name="availability_status"
                  value={formData.availability_status}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-accent disabled:bg-gray-100"
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                  <option value="on_leave">On Leave</option>
                </select>
              </div>

              {editing && (
                <button
                  type="submit"
                  className="w-full py-3 bg-accent text-white rounded-lg font-bold hover:opacity-90 transition"
                >
                  Save Changes
                </button>
              )}
            </form>
          ) : (
            <p className="text-gray-600">Profile data not found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
