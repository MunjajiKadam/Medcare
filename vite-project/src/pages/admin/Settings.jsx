import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Authcontext/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import FormInput from "../../components/FormInput";
import Spinner from "../../components/Spinner";

export default function AdminSettings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [notification, setNotification] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);
  const [message, setMessage] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);

  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    maxAppointmentsPerDay: 20,
    appointmentDuration: 30,
    advanceBookingDays: 30,
  });

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
      console.log("📤 [ADMIN SETTINGS] Saving admin preferences...");
      
      // TODO: Save settings to database
      // await adminAPI.saveSettings({ theme, systemSettings, etc });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("✅ [ADMIN SETTINGS] Settings saved successfully");
      setMessage("✓ Settings saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("❌ [ADMIN SETTINGS] Error saving settings:", error);
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
      console.log("📤 [ADMIN SETTINGS] Changing password...");
      // TODO: Call backend API to change password
      // await adminAPI.changePassword(passwordData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("✅ [ADMIN SETTINGS] Password changed successfully");
      setMessage("✓ Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordErrors({});
      setShowPasswordForm(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("❌ [ADMIN SETTINGS] Error changing password:", error);
      setMessage("✗ Error changing password");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      console.log("📤 [ADMIN SETTINGS] Admin logging out...");
      logout();
      console.log("✅ [ADMIN SETTINGS] Logged out successfully");
      navigate("/admin/login");
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 p-4 sm:p-6 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 mb-6 bg-white dark:bg-gray-800 border-2 border-accent dark:border-accent text-accent rounded-lg hover:bg-accent hover:text-white dark:hover:bg-accent dark:hover:text-white transition font-semibold text-sm"
        >
          ← Back
        </button>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-dark dark:text-white mb-2">⚙️ Admin Settings</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage system preferences and admin account</p>
        </div>

        {message && (
          <div 
            className={`mb-6 p-4 rounded-lg ${
              message.startsWith("✓") 
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700" 
                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700"
            }`}
            role="alert"
          >
            {message}
          </div>
        )}

        {/* Account Section */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6 transition-colors duration-200">
          <h2 className="text-2xl font-bold text-dark dark:text-white mb-6 flex items-center gap-2">
            <span>👤</span> Account Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={user?.username || "admin"}
                disabled
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Role
              </label>
              <input
                type="text"
                value="Administrator"
                disabled
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
              />
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6 transition-colors duration-200">
          <h2 className="text-2xl font-bold text-dark dark:text-white mb-6 flex items-center gap-2">
            <span>🔐</span> Security
          </h2>
          
          <div className="space-y-4">
            {!showPasswordForm ? (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="px-6 py-2 border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition font-semibold"
              >
                🔑 Change Password
              </button>
            ) : (
              <form 
                onSubmit={handleChangePassword}
                className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800"
              >
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
                    placeholder="Enter your new password"
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
                    placeholder="Confirm your new password"
                    required
                  />
                  
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                        setPasswordErrors({});
                      }}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saveLoading}
                      className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saveLoading ? <Spinner size="sm" /> : "Update Password"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Appearance Section */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6 transition-colors duration-200">
          <h2 className="text-2xl font-bold text-dark dark:text-white mb-6 flex items-center gap-2">
            <span>🎨</span> Appearance
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Theme Preference
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === 'light' 
                      ? 'border-accent bg-accent/10 dark:bg-accent/20' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-accent/50'
                  }`}
                >
                  <div className="text-2xl mb-2">☀️</div>
                  <div className="text-sm font-semibold text-dark dark:text-white">Light</div>
                </button>
                
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === 'dark' 
                      ? 'border-accent bg-accent/10 dark:bg-accent/20' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-accent/50'
                  }`}
                >
                  <div className="text-2xl mb-2">🌙</div>
                  <div className="text-sm font-semibold text-dark dark:text-white">Dark</div>
                </button>
                
                <button
                  onClick={() => setTheme('auto')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === 'auto' 
                      ? 'border-accent bg-accent/10 dark:bg-accent/20' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-accent/50'
                  }`}
                >
                  <div className="text-2xl mb-2">💻</div>
                  <div className="text-sm font-semibold text-dark dark:text-white">Auto</div>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6 transition-colors duration-200">
          <h2 className="text-2xl font-bold text-dark dark:text-white mb-6 flex items-center gap-2">
            <span>🔔</span> Notifications
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background dark:bg-gray-700 rounded-lg">
              <div>
                <h3 className="font-semibold text-dark dark:text-white">Push Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications for important events</p>
              </div>
              <button
                onClick={() => setNotification(!notification)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  notification ? 'bg-accent' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    notification ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-background dark:bg-gray-700 rounded-lg">
              <div>
                <h3 className="font-semibold text-dark dark:text-white">Email Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get email alerts for critical updates</p>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  emailNotifications ? 'bg-accent' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    emailNotifications ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* System Settings */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6 transition-colors duration-200">
          <h2 className="text-2xl font-bold text-dark dark:text-white mb-6 flex items-center gap-2">
            <span>🖥️</span> System Settings
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background dark:bg-gray-700 rounded-lg">
              <div>
                <h3 className="font-semibold text-dark dark:text-white">Maintenance Mode</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Disable public access to the system</p>
              </div>
              <button
                onClick={() => setSystemSettings({...systemSettings, maintenanceMode: !systemSettings.maintenanceMode})}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  systemSettings.maintenanceMode ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    systemSettings.maintenanceMode ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-background dark:bg-gray-700 rounded-lg">
              <div>
                <h3 className="font-semibold text-dark dark:text-white">Auto-approve Doctors</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Automatically approve new doctor registrations</p>
              </div>
              <button
                onClick={() => setAutoApprove(!autoApprove)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  autoApprove ? 'bg-accent' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    autoApprove ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Max Appointments/Day
                </label>
                <input
                  type="number"
                  value={systemSettings.maxAppointmentsPerDay}
                  onChange={(e) => setSystemSettings({...systemSettings, maxAppointmentsPerDay: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white focus:border-accent focus:outline-none"
                  min="1"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Appointment Duration (mins)
                </label>
                <select
                  value={systemSettings.appointmentDuration}
                  onChange={(e) => setSystemSettings({...systemSettings, appointmentDuration: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white focus:border-accent focus:outline-none"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Advance Booking Days
              </label>
              <input
                type="number"
                value={systemSettings.advanceBookingDays}
                onChange={(e) => setSystemSettings({...systemSettings, advanceBookingDays: parseInt(e.target.value)})}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white focus:border-accent focus:outline-none"
                min="1"
                max="90"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">How many days in advance patients can book</p>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSaveSettings}
            disabled={saveLoading}
            className="flex-1 px-6 py-3 bg-accent text-white rounded-lg hover:opacity-90 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saveLoading ? <Spinner size="sm" /> : "💾 Save All Settings"}
          </button>
          
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}
