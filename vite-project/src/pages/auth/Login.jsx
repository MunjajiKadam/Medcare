import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Authcontext/AuthContext";
import FormInput from "../../components/FormInput";
import Spinner from "../../components/Spinner";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("patient");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Validation functions
  const validateEmail = (value) => {
    if (!value) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    if (emailError || passwordError) {
      setErrors({ 
        email: emailError, 
        password: passwordError 
      });
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      console.log("📤 [LOGIN PAGE] Attempting login with email:", email, "and userType:", userType);
      await login(email, password, userType);
      console.log("✅ [LOGIN PAGE] Login successful for user:", email);
      setSuccessMessage("✓ Login successful! Redirecting...");
      
      // Redirect based on role
      setTimeout(() => {
        if (userType === "patient") navigate("/patient/dashboard");
        else if (userType === "doctor") navigate("/doctor/dashboard");
      }, 500);
    } catch (error) {
      console.error("❌ [LOGIN PAGE] Login error:", error);
      const errorMsg = error.response?.data?.message || error.message || "Login failed. Please try again.";
      setErrors({ submit: errorMsg });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 sm:top-6 left-4 sm:left-6 px-3 sm:px-4 py-2 bg-background border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition font-semibold text-sm active:scale-95"
        aria-label="Go back"
      >
        ← Back
      </button>

      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="text-4xl mb-3" role="img" aria-label="Hospital">🏥</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark mb-2">Welcome Back</h1>
          <p className="text-sm sm:text-base text-gray-600">Sign in to your MedCare account</p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg" role="alert">
            {successMessage}
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg" role="alert">
            ❌ {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* User Type */}
          <div>
            <label htmlFor="userType" className="block text-sm font-semibold text-dark mb-2">
              Login As <span className="text-red-500" aria-label="required">*</span>
            </label>
            <select
              id="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              aria-label="Select user type"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          {/* Email Field */}
          <FormInput
            label="Email Address"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={loading}
            required
            error={errors.email}
            validate={validateEmail}
            autoComplete="email"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            }
          />

          {/* Password Field */}
          <FormInput
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            disabled={loading}
            required
            error={errors.password}
            validate={validatePassword}
            autoComplete="current-password"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            }
          />

          {/* Remember Me */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent" />
              Remember me
            </label>
            <a href="#" className="text-accent hover:text-accent/80 transition" tabIndex="0">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent text-white rounded-lg font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-95 flex items-center justify-center gap-2"
            aria-label="Sign in to your account"
          >
            {loading ? (
              <>
                <Spinner size="sm" className="" />
                <span>Signing in...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center mt-6 text-sm sm:text-base text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-accent font-semibold hover:text-accent/80 transition">
            Sign Up
          </Link>
        </p>
        
        <p className="text-center mt-4 pt-4 border-t border-gray-300 text-xs sm:text-sm text-gray-600">
          Are you an admin?{" "}
          <Link to="/admin/login" className="text-accent font-semibold hover:text-accent/80 transition">
            Admin Login
          </Link>
        </p>
      </div>
    </div>
  );
}
