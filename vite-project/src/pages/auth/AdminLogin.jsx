import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Authcontext/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme } = useTheme();

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
          <div className="text-5xl mb-4" role="img" aria-label="Lock">🔐</div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">Admin Login</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Restricted Access - Admins Only</p>
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Admin Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@medcare.com"
              disabled={loading}
              className={`w-full px-4 py-3 border-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 transition disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed ${
                errors.email ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20"
              }`}
            />
            {errors.email && <p className="text-red-500 dark:text-red-400 text-sm mt-1">📍 {errors.email}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              disabled={loading}
              className={`w-full px-4 py-3 border-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 transition disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed ${
                errors.password ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20"
              }`}
            />
            {errors.password && <p className="text-red-500 dark:text-red-400 text-sm mt-1">📍 {errors.password}</p>}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white rounded-lg font-bold hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-200 active:scale-95"
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </button>

          {/* Links */}
          <div className="text-center text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              Not an admin?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 dark:hover:text-purple-300 transition"
              >
                User Login
              </button>
            </p>
          </div>
        </form>

        {/* Admin Portal Footer */}
        <div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-700">
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            🛡️ Restricted Admin Portal - All access logged and monitored
          </p>
        </div>
      </div>
    </div>
  );
}
