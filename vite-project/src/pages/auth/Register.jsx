import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Authcontext/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        // Call real API through AuthContext
        console.log("📤 [REGISTER PAGE] Attempting registration with data:", {
          name: formData.name,
          email: formData.email,
          userType: formData.userType,
          specialization: formData.specialization
        });
        
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
          })
        };
        
        await register(registerData);
        console.log("✅ [REGISTER PAGE] Registration successful for email:", formData.email);
        setSuccessMessage("✓ Account created! Redirecting...");
        setFormData({ name: "", email: "", password: "", confirmPassword: "", userType: "patient", specialization: "", experienceYears: "", consultationFee: "", licenseNumber: "" });
        setErrors({});
        
        // Redirect based on role
        setTimeout(() => {
          if (formData.userType === "patient") navigate("/patient/dashboard");
          else if (formData.userType === "doctor") navigate("/doctor/dashboard");
        }, 500);
      } catch (error) {
        console.error("❌ [REGISTER PAGE] Registration error:", error);
        const errorMsg = error.response?.data?.message || error.message;
        setErrors({ submit: errorMsg });
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 px-4 py-2 bg-background border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition font-semibold text-sm"
      >
        ← Back
      </button>

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🏥</div>
          <h2 className="text-3xl font-bold text-dark mb-2">Create Account</h2>
          <p className="text-gray-600">Join MedCare today</p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            ❌ {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              disabled={loading}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition disabled:bg-gray-100 ${
                errors.name ? "border-red-500" : "border-gray-300 focus:border-accent"
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">📍 {errors.name}</p>}
          </div>

          {/* User Type */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">I am a</label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent disabled:bg-gray-100"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          {/* Doctor-specific fields */}
          {formData.userType === "doctor" && (
            <>
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Specialization</label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition disabled:bg-gray-100 ${
                    errors.specialization ? "border-red-500" : "border-gray-300 focus:border-accent"
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
                {errors.specialization && <p className="text-red-500 text-sm mt-1">📍 {errors.specialization}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">License Number</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="e.g., MED-12345"
                  disabled={loading}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition disabled:bg-gray-100 ${
                    errors.licenseNumber ? "border-red-500" : "border-gray-300 focus:border-accent"
                  }`}
                />
                {errors.licenseNumber && <p className="text-red-500 text-sm mt-1">📍 {errors.licenseNumber}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Experience (Years)</label>
                  <input
                    type="number"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    placeholder="e.g., 5"
                    min="0"
                    disabled={loading}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition disabled:bg-gray-100 ${
                      errors.experienceYears ? "border-red-500" : "border-gray-300 focus:border-accent"
                    }`}
                  />
                  {errors.experienceYears && <p className="text-red-500 text-sm mt-1">📍 {errors.experienceYears}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Consultation Fee ($)</label>
                  <input
                    type="number"
                    name="consultationFee"
                    value={formData.consultationFee}
                    onChange={handleChange}
                    placeholder="e.g., 50"
                    min="0"
                    disabled={loading}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition disabled:bg-gray-100 ${
                      errors.consultationFee ? "border-red-500" : "border-gray-300 focus:border-accent"
                    }`}
                  />
                  {errors.consultationFee && <p className="text-red-500 text-sm mt-1">📍 {errors.consultationFee}</p>}
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              disabled={loading}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition disabled:bg-gray-100 ${
                errors.email ? "border-red-500" : "border-gray-300 focus:border-accent"
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">📍 {errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••"
              disabled={loading}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition disabled:bg-gray-100 ${
                errors.password ? "border-red-500" : "border-gray-300 focus:border-accent"
              }`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">📍 {errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••"
              disabled={loading}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition disabled:bg-gray-100 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300 focus:border-accent"
              }`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">📍 {errors.confirmPassword}</p>}
          </div>

          {/* Terms */}
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" className="w-4 h-4" required />
            I agree to the Terms & Conditions
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent text-white rounded-lg font-bold hover:opacity-90 disabled:opacity-50 transition"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Sign In Link */}
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-accent font-semibold hover:text-accent/80">
            Sign In
          </Link>
        </p>
        
        <p className="text-center mt-4 pt-4 border-t border-gray-300 text-sm text-gray-600">
          Are you an admin?{" "}
          <Link to="/admin/login" className="text-accent font-semibold hover:text-accent/80">
            Admin Login
          </Link>
        </p>
      </div>
    </div>
  );
}
