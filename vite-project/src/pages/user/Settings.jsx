import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Authcontext/AuthContext";

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notification, setNotification] = useState(true);
  const [newsletter, setNewsletter] = useState(true);
  const [theme, setTheme] = useState("light");
  const [message, setMessage] = useState("");

  const handleSaveSettings = () => {
    console.log("📤 [USER SETTINGS] Saving user preferences...");
    const settings = {
      notification,
      newsletter,
      theme
    };
    console.log("✅ [USER SETTINGS] Settings saved:", settings);
    setMessage("✓ Settings saved successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      console.log("📤 [USER SETTINGS] User logging out...");
      logout();
      console.log("✅ [USER SETTINGS] Logged out successfully");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-white border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition font-semibold text-sm"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-dark mb-2">⚙️ Settings</h1>
        <p className="text-gray-600 mb-8">Manage your account preferences</p>

        {message && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
            {message}
          </div>
        )}

        {/* Account Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg mb-6">
          <h2 className="text-2xl font-bold text-dark mb-6">👤 Account Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Name</label>
              <input
                type="text"
                value={user?.name || ""}
                disabled
                className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Role</label>
              <input
                type="text"
                value={user?.role || "patient"}
                disabled
                className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <button className="w-full py-2 border-2 border-accent text-accent rounded-lg hover:bg-background transition font-semibold">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white p-8 rounded-xl shadow-lg mb-6">
          <h2 className="text-2xl font-bold text-dark mb-6">🔔 Notifications</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background rounded-lg">
              <div>
                <p className="font-semibold text-dark">Appointment Reminders</p>
                <p className="text-sm text-gray-600">Get reminded about your upcoming appointments</p>
              </div>
              <input
                type="checkbox"
                checked={notification}
                onChange={(e) => setNotification(e.target.checked)}
                className="w-6 h-6 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-background rounded-lg">
              <div>
                <p className="font-semibold text-dark">Newsletter</p>
                <p className="text-sm text-gray-600">Subscribe to health tips and updates</p>
              </div>
              <input
                type="checkbox"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
                className="w-6 h-6 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white p-8 rounded-xl shadow-lg mb-6">
          <h2 className="text-2xl font-bold text-dark mb-6">🎨 Preferences</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-accent"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="bg-white p-8 rounded-xl shadow-lg mb-6">
          <button
            onClick={handleSaveSettings}
            className="w-full py-3 bg-accent text-white rounded-lg font-bold hover:opacity-90 transition"
          >
            💾 Save Settings
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border-2 border-red-200 p-8 rounded-xl">
          <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ Danger Zone</h2>
          
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-500 text-white rounded-lg font-bold hover:opacity-90 transition"
          >
            🚪 Logout
          </button>

          <p className="text-sm text-red-600 mt-4">
            This will logout your current session. You can login again anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
