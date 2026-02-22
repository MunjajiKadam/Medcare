import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doctorAPI, timeSlotAPI } from "../../api/api";
import { formatTime12Hour } from "../../utils/timeFormat";
import { useAuth } from "../../Authcontext/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { theme } = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upcomingSlots, setUpcomingSlots] = useState([]);
  const [editing, setEditing] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
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
      // fetch upcoming slots (tomorrow)
      try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const iso = tomorrow.toISOString().split('T')[0];
        const slotsRes = await timeSlotAPI.getTimeSlots({ doctor_id: doctorData.id, date: iso });
        setUpcomingSlots(slotsRes.data.slots || []);
      } catch (err) {
        console.warn('Could not load upcoming slots', err);
        setUpcomingSlots([]);
      }
    } catch (error) {
      console.error("❌ [DOCTOR PROFILE] Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // Upload image to Cloudinary and return URL
  const uploadToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) throw new Error('Cloudinary config missing');
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', uploadPreset);
    const res = await fetch(url, { method: 'POST', body: fd });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText);
    }
    const data = await res.json();
    console.log('[Cloudinary] Upload response:', data);
    return data.secure_url;
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUploadImage = async () => {
    if (!profileImageFile) return;
    try {
      setImageUploading(true);
      const url = await uploadToCloudinary(profileImageFile);
      console.log('✅ [DOCTOR PROFILE] Cloudinary image URL:', url);
      // update doctor profile with image
      if (profile?.id) {
        await doctorAPI.updateDoctorProfile(profile.id, { profileImage: url });
        // Sync auth context so navbar updates
        updateUser({ profile_image: url });
        setProfileImageFile(null);
        setProfileImagePreview(null);
        fetchProfile();
      }
    } catch (error) {
      console.error('❌ [DOCTOR PROFILE] Image upload error:', error);
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!confirm('Remove profile image?')) return;
    try {
      if (profile?.id) {
        await doctorAPI.updateDoctorProfile(profile.id, { profileImage: 'DELETE' });
        updateUser({ profile_image: null });
        fetchProfile();
      }
    } catch (error) {
      console.error('❌ [DOCTOR PROFILE] Remove image error:', error);
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

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 dark:border-purple-400 mx-auto mb-4"></div>
        <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">Loading profile...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-white dark:bg-gray-800 border-2 border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white transition font-semibold text-sm shadow-md dark:shadow-gray-900/50"
        >
          ← Back
        </button>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl dark:shadow-gray-900/70 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <img
                src={profile?.profile_image || "https://ui-avatars.com/api/?name=" + encodeURIComponent(profile?.name || user?.name || "Doctor") + "&background=random"}
                alt={profile?.name || user?.name || "Doctor"}
                className="w-20 h-20 rounded-full object-cover border-2 border-purple-400 bg-gray-100 dark:bg-gray-700"
                onError={e => { e.target.onerror = null; e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(profile?.name || user?.name || "Doctor") + "&background=random"; }}
              />
              <div className="flex flex-col ml-2">
                <input id="doctor-profile-file" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                <div className="flex items-center gap-2 mt-2">
                  <label htmlFor="doctor-profile-file" className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm cursor-pointer hover:bg-gray-100">Change Photo</label>
                  <button type="button" onClick={handleUploadImage} disabled={imageUploading || !profileImageFile} className="px-3 py-1 bg-purple-600 text-white rounded text-sm disabled:opacity-60">{imageUploading ? 'Uploading...' : 'Upload'}</button>
                  <button type="button" onClick={handleRemoveImage} className="px-3 py-1 bg-red-500 text-white rounded text-sm">Remove</button>
                </div>
                {profileImagePreview && (
                  <img src={profileImagePreview} alt="Preview" className="w-16 h-16 rounded-full object-cover mt-2 border" />
                )}
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">👨‍⚕️ Doctor Profile</h1>
                <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold"
            >
              {editing ? "✕ Cancel" : "✏️ Edit"}
            </button>
          </div>

          {profile ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Specialization */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">🎯 Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 disabled:bg-gray-100 dark:disabled:bg-gray-600 transition"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">💼 Years of Experience</label>
                <input
                  type="number"
                  name="experience_years"
                  value={formData.experience_years}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 disabled:bg-gray-100 dark:disabled:bg-gray-600 transition"
                />
              </div>

              {/* Consultation Fee */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">💰 Consultation Fee ($)</label>
                <input
                  type="number"
                  name="consultation_fee"
                  value={formData.consultation_fee}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 disabled:bg-gray-100 dark:disabled:bg-gray-600 transition"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">📝 Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!editing}
                  rows="4"
                  className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 disabled:bg-gray-100 dark:disabled:bg-gray-600 transition"
                />
              </div>

              {/* Availability Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">🟢 Availability</label>
                <select
                  name="availability_status"
                  value={formData.availability_status}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 disabled:bg-gray-100 dark:disabled:bg-gray-600 transition"
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                  <option value="on_leave">On Leave</option>
                </select>
              </div>

              {/* Upcoming Slots */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">⏰ Upcoming Slots (Tomorrow)</label>
                <div className="flex flex-wrap gap-2">
                  {upcomingSlots.length > 0 ? upcomingSlots.slice(0,8).map((t,idx) => (
                    <div key={idx} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                      {formatTime12Hour(t)} • 30m
                    </div>
                  )) : (
                    <div className="text-sm text-gray-500">No slots available tomorrow</div>
                  )}
                </div>
              </div>

              {editing && (
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white rounded-lg font-bold hover:shadow-xl hover:scale-105 transition-all duration-200"
                >
                  💾 Save Changes
                </button>
              )}
            </form>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">Profile data not found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
