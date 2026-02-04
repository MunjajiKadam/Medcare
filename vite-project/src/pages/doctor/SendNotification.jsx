import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { notificationAPI } from "../../api/api";
import { useTheme } from "../../context/ThemeContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function SendNotification() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    patient_id: "",
    title: "",
    message: ""
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      console.log("📤 [SEND NOTIFICATION] Fetching doctor's patients...");
      const response = await notificationAPI.getDoctorPatients();
      console.log("✅ [SEND NOTIFICATION] Patients received:", response.data);
      setPatients(response.data.patients || []);
    } catch (error) {
      console.error("❌ [SEND NOTIFICATION] Error loading patients:", error);
      setMessage("Error loading patients: " + error.response?.data?.message);
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.patient_id || !formData.title.trim() || !formData.message.trim()) {
      setMessage("❌ Please fill in all fields");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      setSending(true);
      console.log("📤 [SEND NOTIFICATION] Sending notification:", formData);
      await notificationAPI.sendToPatient(formData);
      console.log("✅ [SEND NOTIFICATION] Notification sent successfully");
      setMessage("✓ Notification sent successfully!");
      setFormData({ patient_id: "", title: "", message: "" });
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("❌ [SEND NOTIFICATION] Error sending notification:", error);
      setMessage("✗ Error: " + error.response?.data?.message);
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading patients...</p>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 px-4 py-2 bg-white dark:bg-gray-800 border-2 border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white transition font-semibold text-sm active:scale-95 shadow-md dark:shadow-gray-900/50"
          >
            ← Back
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-8 border border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">📬 Send Notification to Patient</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Send a direct message notification to your patients</p>

            {message && (
              <div className={`mb-6 p-4 rounded-lg border-2 ${
                message.includes("✓") 
                  ? "bg-green-100 dark:bg-green-900/30 border-green-400 dark:border-green-600 text-green-700 dark:text-green-400" 
                  : "bg-red-100 dark:bg-red-900/30 border-red-400 dark:border-red-600 text-red-700 dark:text-red-400"
              }`}>
                {message}
              </div>
            )}

            {patients.length === 0 ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-700 rounded-lg p-6 text-center">
                <p className="text-yellow-800 dark:text-yellow-300 font-semibold mb-2">📋 No Patients Found</p>
                <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                  You don't have any patients yet. Patients will appear here after they book appointments with you.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Select Patient <span className="text-red-500 dark:text-red-400">*</span>
                  </label>
                  <select
                    name="patient_id"
                    value={formData.patient_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 transition"
                    required
                  >
                    <option value="">Choose a patient...</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} - {patient.email}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {patients.length} patient{patients.length !== 1 ? 's' : ''} available
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Notification Title <span className="text-red-500 dark:text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="E.g., Appointment Reminder, Health Update, etc."
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 transition"
                    maxLength="100"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formData.title.length}/100 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Message <span className="text-red-500 dark:text-red-400">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your notification message here..."
                    rows="6"
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 transition"
                    maxLength="500"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formData.message.length}/500 characters
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ patient_id: "", title: "", message: "" })}
                    className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition active:scale-95"
                  >
                    Clear Form
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white rounded-lg font-bold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    {sending ? "Sending..." : "📤 Send Notification"}
                  </button>
                </div>
              </form>
            )}

            {/* Quick Tips */}
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 p-4 rounded">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 Tips for Effective Notifications</h3>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li>• Keep messages clear and concise</li>
                <li>• Use descriptive titles (e.g., "Lab Results Ready")</li>
                <li>• Include action items if needed</li>
                <li>• Be professional and courteous</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
