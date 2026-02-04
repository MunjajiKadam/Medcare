import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { notificationAPI } from "../../api/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function SendNotification() {
  const navigate = useNavigate();
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading patients...</p>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 px-4 py-2 bg-white border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition font-semibold text-sm"
          >
            ← Back
          </button>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-dark mb-2">📬 Send Notification to Patient</h1>
            <p className="text-gray-600 mb-6">Send a direct message notification to your patients</p>

            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.includes("✓") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {message}
              </div>
            )}

            {patients.length === 0 ? (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 text-center">
                <p className="text-yellow-800 font-semibold mb-2">📋 No Patients Found</p>
                <p className="text-yellow-700 text-sm">
                  You don't have any patients yet. Patients will appear here after they book appointments with you.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Select Patient <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="patient_id"
                    value={formData.patient_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                    required
                  >
                    <option value="">Choose a patient...</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} - {patient.email}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {patients.length} patient{patients.length !== 1 ? 's' : ''} available
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Notification Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="E.g., Appointment Reminder, Health Update, etc."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                    maxLength="100"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.title.length}/100 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your notification message here..."
                    rows="6"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                    maxLength="500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.message.length}/500 characters
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ patient_id: "", title: "", message: "" })}
                    className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300 transition"
                  >
                    Clear Form
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex-1 py-3 bg-accent text-white rounded-lg font-bold hover:opacity-90 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {sending ? "Sending..." : "📤 Send Notification"}
                  </button>
                </div>
              </form>
            )}

            {/* Quick Tips */}
            <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Tips for Effective Notifications</h3>
              <ul className="text-sm text-blue-800 space-y-1">
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
