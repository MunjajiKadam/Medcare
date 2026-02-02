import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Authcontext/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("patient");
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
        // Call real API through AuthContext
        console.log("📤 [LOGIN PAGE] Attempting login with email:", email, "and userType:", userType);
        await login(email, password, userType);
        console.log("✅ [LOGIN PAGE] Login successful for user:", email);
        setSuccessMessage("✓ Login successful! Redirecting...");
        setEmail("");
        setPassword("");
        setErrors({});
        
        // Redirect based on role - slight delay for state update
        setTimeout(() => {
          if (userType === "patient") navigate("/user/dashboard");
          else if (userType === "doctor") navigate("/doctor/dashboard");
        }, 500);
      } catch (error) {
        console.error("❌ [LOGIN PAGE] Login error:", error);
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
          <h2 className="text-3xl font-bold text-dark mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your MedCare account</p>
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
          {/* User Type */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Login As</label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-accent"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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

          {/* Demo Credentials */}
          <div className="bg-background p-3 rounded-lg text-xs text-gray-600">
            <p className="font-semibold mb-1">📝 Demo Credentials:</p>
            <p>Email: demo@example.com</p>
            <p>Password: 123456</p>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="w-4 h-4" />
              Remember me
            </label>
            <a href="#" className="text-accent hover:text-accent/80">Forgot password?</a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent text-white rounded-lg font-bold hover:opacity-90 disabled:opacity-50 transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-accent font-semibold hover:text-accent/80">
            Sign Up
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
