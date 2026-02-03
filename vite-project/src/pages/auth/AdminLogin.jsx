import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Authcontext/AuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        console.log("📤 [ADMIN LOGIN PAGE] Attempting admin login with email:", email);
        await login(email, password, "admin");
        console.log("✅ [ADMIN LOGIN PAGE] Admin login successful for user:", email);
        setSuccessMessage("✓ Admin login successful! Redirecting...");
        setEmail("");
        setPassword("");
        setErrors({});
        
        // Redirect to admin dashboard
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 500);
      } catch (error) {
        console.error("❌ [ADMIN LOGIN PAGE] Admin login error:", error);
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
          <div className="text-4xl mb-3">🔐</div>
          <h2 className="text-3xl font-bold text-dark mb-2">Admin Login</h2>
          <p className="text-gray-600">Restricted Access - Admins Only</p>
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Admin Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="any@medcare.com"
              disabled={loading}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition disabled:bg-gray-100 ${
                errors.email ? "border-red-500" : "border-gray-300 focus:border-accent"
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">📍 {errors.email}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              disabled={loading}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition disabled:bg-gray-100 ${
                errors.password ? "border-red-500" : "border-gray-300 focus:border-accent"
              }`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">📍 {errors.password}</p>}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-accent/90 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </button>

          {/* Links */}
          <div className="text-center text-sm">
            <p className="text-gray-600">
              Not an admin?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-accent hover:text-accent/80 font-semibold"
              >
                User Login
              </button>
            </p>
          </div>
        </form>

        {/* Admin Portal Footer */}
        <div className="mt-6 pt-6 border-t border-gray-300">
          <p className="text-center text-xs text-gray-500">
            🛡️ Restricted Admin Portal - All access logged and monitored
          </p>
        </div>
      </div>
    </div>
  );
}
