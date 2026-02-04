import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Authcontext/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import axios from "../../api/axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import FormInput from "../../components/FormInput";
import Spinner from "../../components/Spinner";

export default function DoctorSettings() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [notification, setNotification] = useState(true);
  const [newsletter, setNewsletter] = useState(true);
  const [message, setMessage] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Validation functions
  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password.length > 50) return "Password must be less than 50 characters";
    return "";
  };

  const validateConfirmPassword = (confirmPassword, newPassword) => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== newPassword) return "Passwords do not match";
    return "";
  };

  const handleSaveSettings = async () => {
    if (saveLoading) return;
    try {
      setSaveLoading(true);
      console.log("📤 [DOCTOR SETTINGS] Saving doctor preferences...");
      
      // Save theme to database
      const response = await axios.put("/doctors/settings", { theme });
      
      // Update user data in AuthContext
      updateUser({ theme });
      
      console.log("✅ [DOCTOR SETTINGS] Settings saved successfully");
      setMessage("✓ Settings saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("❌ [DOCTOR SETTINGS] Error saving settings:", error);
      setMessage("✗ Error saving settings");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const errors = {};
    const currentError = validatePassword(passwordData.currentPassword);
    const newError = validatePassword(passwordData.newPassword);
    const confirmError = validateConfirmPassword(passwordData.confirmPassword, passwordData.newPassword);

    if (currentError) errors.currentPassword = currentError;
    if (newError) errors.newPassword = newError;
    if (confirmError) errors.confirmPassword = confirmError;

    setPasswordErrors(errors);

    if (Object.keys(errors).length > 0) {
      setMessage("✗ Please fix the errors before submitting");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      setSaveLoading(true);
      console.log("📤 [DOCTOR SETTINGS] Changing password...");
      // TODO: Call backend API to change password
      // await userAPI.changePassword(passwordData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("✅ [DOCTOR SETTINGS] Password changed successfully");
      setMessage("✓ Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordErrors({});
      setShowPasswordForm(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("❌ [DOCTOR SETTINGS] Error changing password:", error);
      setMessage("✗ Error changing password");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      console.log("📤 [DOCTOR SETTINGS] Doctor logging out...");
      logout();
      console.log("✅ [DOCTOR SETTINGS] Logged out successfully");
      navigate("/login");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background dark:bg-gray-900 p-4 sm:p-6 transition-colors duration-200">
        <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="btn-outline mb-6 flex items-center gap-2"
          aria-label="Go back to previous page"
        >
          <span aria-hidden="true">←</span> Back
        </button>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-dark dark:text-white mb-2">⚙️ Settings</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your account preferences and security</p>
        </div>

        {message && (
          <div 
            className={`mb-6 p-4 rounded-lg ${
              message.startsWith("✓") 
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700" 
                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700"
            }`}
            role="alert"
            aria-live="polite"
          >
            {message}
          </div>
        )}

        {/* Account Section */}
        <section className="card mb-6" aria-labelledby="account-heading">
          <h2 id="account-heading" className="text-2xl font-bold text-dark dark:text-white mb-6 flex items-center gap-2">
            <span aria-hidden="true">👤</span> Account Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
                aria-readonly="true"
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={user?.name || ""}
                disabled
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
                aria-readonly="true"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Account Type
              </label>
              <input
                id="role"
                type="text"
                value={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || "Doctor"}
                disabled
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
                aria-readonly="true"
              />
            </div>

            <button 
              className="btn-outline w-full sm:w-auto"
              onClick={() => navigate("/doctor/profile")}
              aria-label="Edit profile information"
            >
              ✏️ Edit Profile
            </button>
          </div>
        </section>

        {/* Security Section */}
        <section className="card mb-6" aria-labelledby="security-heading">
          <h2 id="security-heading" className="text-2xl font-bold text-dark dark:text-white mb-6 flex items-center gap-2">
            <span aria-hidden="true">🔐</span> Security
          </h2>
          
          <div className="space-y-4">
            {!showPasswordForm ? (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="btn-outline w-full sm:w-auto"
                aria-label="Show password change form"
              >
                🔑 Change Password
              </button>
            ) : (
              <form 
                onSubmit={handleChangePassword}
                className="bg-blue-50 dark:bg-blue-900/20 p-4 sm:p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800"
                aria-labelledby="password-form-heading"
              >
                <h3 id="password-form-heading" className="sr-only">Change Password Form</h3>
                <div className="space-y-4">
                  <FormInput
                    label="Current Password"
                    type="password"
                    id="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={(e) => {
                      setPasswordData({ ...passwordData, currentPassword: e.target.value });
                      if (passwordErrors.currentPassword) {
                        setPasswordErrors({ ...passwordErrors, currentPassword: "" });
                      }
                    }}
                    error={passwordErrors.currentPassword}
                    placeholder="Enter your current password"
                    required
                  />
                  
                  <FormInput
                    label="New Password"
                    type="password"
                    id="newPassword"
                    value={passwordData.newPassword}
                    onChange={(e) => {
                      setPasswordData({ ...passwordData, newPassword: e.target.value });
                      if (passwordErrors.newPassword) {
                        setPasswordErrors({ ...passwordErrors, newPassword: "" });
                      }
                    }}
                    error={passwordErrors.newPassword}
                    placeholder="Enter new password (min. 6 characters)"
                    required
                  />
                  
                  <FormInput
                    label="Confirm New Password"
                    type="password"
                    id="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={(e) => {
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value });
                      if (passwordErrors.confirmPassword) {
                        setPasswordErrors({ ...passwordErrors, confirmPassword: "" });
                      }
                    }}
                    error={passwordErrors.confirmPassword}
                    placeholder="Re-enter your new password"
                    required
                  />
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={saveLoading}
                      className="btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {saveLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Spinner size="sm" /> Updating...
                        </span>
                      ) : (
                        "Update Password"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                        setPasswordErrors({});
                      }}
                      disabled={saveLoading}
                      className="btn-outline flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
              <div>
                <p className="font-semibold text-dark dark:text-white">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security</p>
              </div>
              <button
                onClick={() => {
                  setTwoFactorEnabled(!twoFactorEnabled);
                  setMessage(
                    twoFactorEnabled 
                      ? "✗ Two-factor authentication disabled" 
                      : "✓ Two-factor authentication enabled"
                  );
                  setTimeout(() => setMessage(""), 3000);
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  twoFactorEnabled
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                }`}
                aria-label={`Two-factor authentication is ${twoFactorEnabled ? "enabled" : "disabled"}`}
              >
                {twoFactorEnabled ? "Enabled" : "Disabled"}
              </button>
            </div>
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="card mb-6" aria-labelledby="notifications-heading">
          <h2 id="notifications-heading" className="text-2xl font-bold text-dark mb-6 flex items-center gap-2">
            <span aria-hidden="true">🔔</span> Notification Preferences
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
              <div>
                <p className="font-semibold text-dark dark:text-white">Appointment Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive alerts about appointments</p>
              </div>
              <button
                onClick={() => setNotification(!notification)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  notification
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                }`}
                aria-label={`Notifications are ${notification ? "enabled" : "disabled"}`}
              >
                {notification ? "On" : "Off"}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
              <div>
                <p className="font-semibold text-dark dark:text-white">Newsletter</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get updates about MedCare</p>
              </div>
              <button
                onClick={() => setNewsletter(!newsletter)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  newsletter
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                }`}
                aria-label={`Newsletter is ${newsletter ? "enabled" : "disabled"}`}
              >
                {newsletter ? "Subscribed" : "Unsubscribed"}
              </button>
            </div>
          </div>

          <button
            onClick={handleSaveSettings}
            disabled={saveLoading}
            className="btn-primary w-full sm:w-auto mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saveLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner size="sm" /> Saving...
              </span>
            ) : (
              "💾 Save Preferences"
            )}
          </button>
        </section>

        {/* Appearance */}
        <section className="card mb-6" aria-labelledby="appearance-heading">
          <h2 id="appearance-heading" className="text-2xl font-bold text-dark dark:text-white mb-6 flex items-center gap-2">
            <span aria-hidden="true">🎨</span> Appearance
          </h2>
          
          <div className="space-y-4">
            <label htmlFor="theme" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Theme Preference
            </label>
            <select
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              aria-label="Select theme preference"
            >
              <option value="light">☀️ Light Theme</option>
              <option value="dark">🌙 Dark Theme</option>
              <option value="auto">🔄 Auto (System)</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Choose how MedCare appears to you</p>
          </div>
        </section>

        {/* Professional Settings (Doctor-specific) */}
        <section className="card mb-6" aria-labelledby="professional-heading">
          <h2 id="professional-heading" className="text-2xl font-bold text-dark dark:text-white mb-6 flex items-center gap-2">
            <span aria-hidden="true">🩺</span> Professional Settings
          </h2>
          
          <div className="space-y-4">
            <button 
              className="btn-outline w-full sm:w-auto"
              onClick={() => navigate("/doctor/time-slots")}
              aria-label="Manage availability schedule"
            >
              📅 Manage Availability
            </button>
            
            <button 
              className="btn-outline w-full sm:w-auto ml-0 sm:ml-3"
              onClick={() => navigate("/doctor/profile")}
              aria-label="Update professional information"
            >
              📋 Update Professional Info
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="card border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20" aria-labelledby="danger-heading">
          <h2 id="danger-heading" className="text-2xl font-bold text-red-700 dark:text-red-400 mb-6 flex items-center gap-2">
            <span aria-hidden="true">⚠️</span> Danger Zone
          </h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Once you logout, you will need to sign in again to access your account.
              </p>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors w-full sm:w-auto"
              >
                🚪 Logout
              </button>
            </div>

            <div className="pt-4 border-t-2 border-red-200 dark:border-red-700">
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <button
                onClick={() => {
                  if (confirm("Are you absolutely sure? This action cannot be undone!")) {
                    setMessage("✗ Account deletion is not available in demo mode");
                    setTimeout(() => setMessage(""), 3000);
                  }
                }}
                className="bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors w-full sm:w-auto"
              >
                🗑️ Delete Account
              </button>
            </div>
          </div>
        </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
