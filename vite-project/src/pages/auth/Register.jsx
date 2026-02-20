import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Authcontext/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "patient",
    specialization: "",
    experienceYears: "",
    consultationFee: "",
    licenseNumber: "",
    profileImage: null,
    profileImagePreview: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    
    // Doctor-specific validation
    if (formData.userType === "doctor") {
      if (!formData.specialization) newErrors.specialization = "Specialization is required";
      if (!formData.licenseNumber) newErrors.licenseNumber = "License number is required";
      if (!formData.experienceYears) newErrors.experienceYears = "Experience is required";
      if (!formData.consultationFee) newErrors.consultationFee = "Consultation fee is required";
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Store file for upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profileImage: file,
        profileImagePreview: URL.createObjectURL(file),
      }));
    }
  };

  // Upload image to Cloudinary and return URL
  const uploadToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) throw new Error("Cloudinary config missing");
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    try {
      const res = await fetch(url, { method: "POST", body: formData });
      if (!res.ok) {
        const errText = await res.text();
        console.error("[Cloudinary] Upload failed:", errText);
        throw new Error("Image upload failed: " + errText);
      }
      const data = await res.json();
      console.log("[Cloudinary] Upload response:", data);
      return data.secure_url;
    } catch (err) {
      console.error("[Cloudinary] Upload error:", err);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        let imageUrl = "";
        if (formData.profileImage) {
          imageUrl = await uploadToCloudinary(formData.profileImage);
          console.log("[Register] Cloudinary image URL:", imageUrl);
        }
        const registerData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          userType: formData.userType,
          ...(formData.userType === "doctor" && {
            specialization: formData.specialization,
            experienceYears: formData.experienceYears,
            consultationFee: formData.consultationFee,
            licenseNumber: formData.licenseNumber,
          }),
        };
        // Always send profileImage as camelCase for backend compatibility
        if (imageUrl) registerData.profileImage = imageUrl;
        console.log("[Register] Registration request payload:", registerData);
        const regResult = await register(registerData);
        console.log("[Register] Backend response:", regResult);
        if (regResult && regResult.profile_image) {
          console.log("[Register] Final profile_image URL:", regResult.profile_image);
        } else {
          console.warn("[Register] No profile_image in backend response.", regResult);
        }
        setSuccessMessage("✓ Account created! Redirecting...");
        setFormData({ name: "", email: "", password: "", confirmPassword: "", userType: "patient", specialization: "", experienceYears: "", consultationFee: "", licenseNumber: "", profileImage: null, profileImagePreview: null });
        setErrors({});
        setTimeout(() => {
          if (formData.userType === "patient") navigate("/patient/dashboard");
          else if (formData.userType === "doctor") navigate("/doctor/dashboard");
        }, 500);
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message;
        setErrors({ submit: errorMsg });
        setLoading(false);
        console.error("[Register] Error:", error);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 sm:top-6 left-4 sm:left-6 px-3 sm:px-4 py-2 bg-white dark:bg-gray-800 border-2 border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white transition font-semibold text-sm active:scale-95 shadow-md dark:shadow-gray-900/50"
      >
        ← Back
      </button>

      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl dark:shadow-gray-900/70 w-full max-w-md border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="text-5xl mb-4" role="img" aria-label="Hospital">🏥</div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">Create Account</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Join MedCare today</p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border-2 border-green-400 dark:border-green-600 text-green-700 dark:text-green-400 rounded-lg" role="alert">
            {successMessage}
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 rounded-lg" role="alert">
            ❌ {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Profile Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 transition disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
            />
            {formData.profileImagePreview && (
              <img
                src={formData.profileImagePreview}
                alt="Profile Preview"
                className="mt-2 w-20 h-20 rounded-full object-cover border-2 border-purple-400"
              />
            )}
          </div>
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              disabled={loading}
              className={`w-full px-4 py-3 border-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 transition disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed ${
                errors.name ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20"
              }`}
            />
            {errors.name && <p className="text-red-500 dark:text-red-400 text-sm mt-1">📍 {errors.name}</p>}
          </div>

          {/* User Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">I am a</label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 transition disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          {/* Doctor-specific fields */}
          {formData.userType === "doctor" && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Specialization</label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-4 py-3 border-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 transition disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed ${
                    errors.specialization ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20"
                  }`}
                >
                  <option value="">Select Specialization</option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Orthopedic">Orthopedic</option>
                  <option value="Pediatrician">Pediatrician</option>
                  <option value="Psychiatrist">Psychiatrist</option>
                  <option value="Gynecologist">Gynecologist</option>
                  <option value="Ophthalmologist">Ophthalmologist</option>
                  <option value="ENT Specialist">ENT Specialist</option>
                  <option value="General Physician">General Physician</option>
                  <option value="Other">Other</option>
                </select>
                {errors.specialization && <p className="text-red-500 dark:text-red-400 text-sm mt-1">📍 {errors.specialization}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">License Number</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="e.g., MED-12345"
                  disabled={loading}
                  className={`w-full px-4 py-3 border-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 transition disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed ${
                    errors.licenseNumber ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20"
                  }`}
                />
                {errors.licenseNumber && <p className="text-red-500 dark:text-red-400 text-sm mt-1">📍 {errors.licenseNumber}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Experience (Years)</label>
                  <input
                    type="number"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    placeholder="e.g., 5"
                    min="0"
                    disabled={loading}
                    className={`w-full px-4 py-3 border-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 transition disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed ${
                      errors.experienceYears ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20"
                    }`}
                  />
                  {errors.experienceYears && <p className="text-red-500 dark:text-red-400 text-sm mt-1">📍 {errors.experienceYears}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Consultation Fee ($)</label>
                  <input
                    type="number"
                    name="consultationFee"
                    value={formData.consultationFee}
                    onChange={handleChange}
                    placeholder="e.g., 50"
                    min="0"
                    disabled={loading}
                    className={`w-full px-4 py-3 border-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 transition disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed ${
                      errors.consultationFee ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20"
                    }`}
                  />
                  {errors.consultationFee && <p className="text-red-500 dark:text-red-400 text-sm mt-1">📍 {errors.consultationFee}</p>}
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              disabled={loading}
              className={`w-full px-4 py-3 border-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 transition disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed ${
                errors.email ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20"
              }`}
            />
            {errors.email && <p className="text-red-500 dark:text-red-400 text-sm mt-1">📍 {errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••"
              disabled={loading}
              className={`w-full px-4 py-3 border-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 transition disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed ${
                errors.password ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20"
              }`}
            />
            {errors.password && <p className="text-red-500 dark:text-red-400 text-sm mt-1">📍 {errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••"
              disabled={loading}
              className={`w-full px-4 py-3 border-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 transition disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed ${
                errors.confirmPassword ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20"
              }`}
            />
            {errors.confirmPassword && <p className="text-red-500 dark:text-red-400 text-sm mt-1">📍 {errors.confirmPassword}</p>}
          </div>

          {/* Terms */}
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500 dark:bg-gray-700" required />
            I agree to the Terms & Conditions
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white rounded-lg font-bold hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-200 active:scale-95"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Sign In Link */}
        <p className="text-center mt-6 text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 dark:hover:text-purple-300 transition">
            Sign In
          </Link>
        </p>
        
        <p className="text-center mt-4 pt-4 border-t border-gray-300 dark:border-gray-700 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Are you an admin?{" "}
          <Link to="/admin/login" className="text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 dark:hover:text-purple-300 transition">
            Admin Login
          </Link>
        </p>
      </div>
    </div>
  );
}
