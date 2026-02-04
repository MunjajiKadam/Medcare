import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Authcontext/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { patientAPI, healthRecordAPI } from "../../api/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [profile, setProfile] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [personalData, setPersonalData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [formData, setFormData] = useState({
    blood_type: "",
    date_of_birth: "",
    gender: "male",
    medical_history: "",
    allergies: "",
    emergency_contact: "",
    emergency_phone: "",
  });
  const [newRecord, setNewRecord] = useState({
    record_type: "",
    record_value: "",
  });
  const [message, setMessage] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("📤 [USER PROFILE] Fetching user profile data from API...");
      const profileRes = await patientAPI.getPatientProfile();
      console.log("✅ [USER PROFILE] Patient profile received from backend:", profileRes.data);
      setProfile(profileRes.data.patient);
      setPersonalData({
        name: profileRes.data.patient.name || "",
        email: profileRes.data.patient.email || "",
        phone: profileRes.data.patient.phone || "",
      });
      setFormData({
        blood_type: profileRes.data.patient.blood_type || "",
        date_of_birth: profileRes.data.patient.date_of_birth || "",
        gender: profileRes.data.patient.gender || "male",
        medical_history: profileRes.data.patient.medical_history || "",
        allergies: profileRes.data.patient.allergies || "",
        emergency_contact: profileRes.data.patient.emergency_contact || "",
        emergency_phone: profileRes.data.patient.emergency_phone || "",
      });
      const recordsRes = await healthRecordAPI.getHealthRecords();
      console.log("✅ [USER PROFILE] Health records received from backend:", recordsRes.data);
      setHealthRecords(recordsRes.data.records);
    } catch (error) {
      console.error("❌ [USER PROFILE] Error loading data:", error);
      setMessage("Error loading: " + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePersonalChange = (e) => {
    setPersonalData({ ...personalData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saveLoading) {
      console.warn("⏳ [USER PROFILE] Save already in progress, please wait...");
      return;
    }
    try {
      setSaveLoading(true);
      console.log("📤 [USER PROFILE] Updating patient profile with health data:", formData);
      await patientAPI.updatePatientProfile(formData);
      console.log("✅ [USER PROFILE] Health profile updated successfully");
      setMessage("✓ Health Profile updated!");
      setEditing(false);
      await new Promise(resolve => setTimeout(resolve, 1500));
      fetchData();
    } catch (error) {
      console.error("❌ [USER PROFILE] Error updating profile:", error);
      setMessage("✗ Error: " + error.response?.data?.message);
      await new Promise(resolve => setTimeout(resolve, 1500));
    } finally {
      setSaveLoading(false);
    }
  };

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    if (saveLoading) {
      console.warn("⏳ [USER PROFILE] Save already in progress, please wait...");
      return;
    }
    try {
      setSaveLoading(true);
      console.log("📤 [USER PROFILE] Updating personal info:", personalData);
      await patientAPI.updatePersonalInfo(personalData);
      console.log("✅ [USER PROFILE] Personal info updated successfully");
      setMessage("✓ Personal Info updated!");
      setEditing(false);
      await new Promise(resolve => setTimeout(resolve, 1500));
      fetchData();
    } catch (error) {
      console.error("❌ [USER PROFILE] Error updating personal info:", error);
      setMessage("✗ Error: " + error.response?.data?.message);
      await new Promise(resolve => setTimeout(resolve, 1500));
    } finally {
      setSaveLoading(false);
    }
  };

  const addHealthRecord = async (e) => {
    e.preventDefault();
    try {
      console.log("📤 [USER PROFILE] Adding health record:", newRecord);
      await healthRecordAPI.createHealthRecord({
        ...newRecord,
        record_date: new Date().toISOString().split("T")[0],
      });
      console.log("✅ [USER PROFILE] Health record added successfully");
      setMessage("✓ Record added!");
      setNewRecord({ record_type: "", record_value: "" });
      fetchData();
    } catch (error) {
      console.error("❌ [USER PROFILE] Error adding record:", error);
      setMessage("✗ Error: " + error.response?.data?.message);
    }
  };

  const deleteRecord = async (id) => {
    if (confirm("Delete this record?")) {
      try {
        console.log(`📤 [USER PROFILE] Deleting health record ID: ${id}`);
        await healthRecordAPI.deleteHealthRecord(id);
        console.log("✅ [USER PROFILE] Health record deleted successfully");
        setMessage("✓ Record deleted!");
        fetchData();
      } catch (error) {
        console.error("❌ [USER PROFILE] Error deleting record:", error);
        setMessage("✗ Error: " + error.response?.data?.message);
      }
    }
  };

  const handleViewDetails = (record) => {
    console.log("👁️ [USER PROFILE] Viewing details for record:", record);
    setSelectedRecord(record);
    setShowModal(true);
  };

  const handleDownload = (record) => {
    console.log("📥 [USER PROFILE] Downloading record:", record);
    try {
      const content = `
HEALTH RECORD DETAILS
=====================

Record Type: ${record.record_type}
Value: ${record.record_value}
Date: ${new Date(record.record_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
${record.notes ? `Notes: ${record.notes}` : ''}

---
Downloaded on: ${new Date().toLocaleString()}
      `.trim();

      const element = document.createElement('a');
      const file = new Blob([content], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `health-record-${record.record_type.replace(/\s+/g, '-')}-${new Date(record.record_date).toISOString().split('T')[0]}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      console.log("✅ [USER PROFILE] Record downloaded successfully");
      setMessage("✓ Record downloaded!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("❌ [USER PROFILE] Error downloading record:", error);
      setMessage("Error downloading record");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 dark:border-purple-400 mx-auto mb-4"></div>
        <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">Loading profile...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-white dark:bg-gray-800 border-2 border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white transition font-semibold shadow-md dark:shadow-gray-900/50"
        >
          ← Back
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-gray-900/70 p-8 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">👤 My Profile</h1>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
            </div>
            {activeTab === "profile" && (
              <button
                onClick={() => setEditing(!editing)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold"
              >
                {editing ? "✕ Cancel" : "✏️ Edit"}
              </button>
            )}
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg shadow-md ${
            message.includes("✓") 
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800" 
              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
          }`}>
            {message}
          </div>
        )}

        <div className="flex gap-4 mb-6 border-b-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-xl px-4 shadow-md dark:shadow-gray-900/50">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-4 font-semibold transition-all duration-200 ${
              activeTab === "profile" 
                ? "border-b-4 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400" 
                : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
            }`}
          >
            📋 Profile Info
          </button>
          <button
            onClick={() => setActiveTab("health")}
            className={`px-6 py-4 font-semibold transition-all duration-200 ${
              activeTab === "health" 
                ? "border-b-4 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400" 
                : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
            }`}
          >
            🏥 Health Records
          </button>
        </div>

        {activeTab === "profile" && (
          <form onSubmit={editing ? handlePersonalSubmit : null} className="bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-gray-900/70 p-8 space-y-6 border border-gray-200 dark:border-gray-700">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">👤 Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">👤 Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={personalData.name} 
                    onChange={handlePersonalChange} 
                    disabled={!editing} 
                    placeholder="Your name" 
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 disabled:bg-gray-100 dark:disabled:bg-gray-600 transition" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">📧 Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={personalData.email} 
                    onChange={handlePersonalChange} 
                    disabled={!editing} 
                    placeholder="your@email.com" 
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 disabled:bg-gray-100 dark:disabled:bg-gray-600 transition" 
                  />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">📞 Phone</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={personalData.phone} 
                    onChange={handlePersonalChange} 
                    disabled={!editing} 
                    placeholder="+1234567890" 
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 disabled:bg-gray-100 dark:disabled:bg-gray-600 transition" 
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">🏥 Health Information</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">🩸 Blood Type</label>
                    <input type="text" name="blood_type" value={formData.blood_type} onChange={handleChange} disabled={!editing} placeholder="O+" className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 disabled:bg-gray-100 dark:disabled:bg-gray-600 transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">⚧️ Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} disabled={!editing} className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 disabled:bg-gray-100 dark:disabled:bg-gray-600 transition">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">📅 DOB</label>
                    <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} disabled={!editing} className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 disabled:bg-gray-100 dark:disabled:bg-gray-600 transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">📞 Emergency Phone</label>
                    <input type="tel" name="emergency_phone" value={formData.emergency_phone} onChange={handleChange} disabled={!editing} placeholder="+1234567890" className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 disabled:bg-gray-100 dark:disabled:bg-gray-600 transition" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">👥 Emergency Contact</label>
                  <input type="text" name="emergency_contact" value={formData.emergency_contact} onChange={handleChange} disabled={!editing} placeholder="Contact name" className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 disabled:bg-gray-100 dark:disabled:bg-gray-600 transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">📋 Medical History</label>
                  <textarea name="medical_history" value={formData.medical_history} onChange={handleChange} disabled={!editing} placeholder="Any past conditions..." rows="3" className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 disabled:bg-gray-100 dark:disabled:bg-gray-600 transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">⚠️ Allergies</label>
                  <textarea name="allergies" value={formData.allergies} onChange={handleChange} disabled={!editing} placeholder="Any allergies..." rows="3" className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 disabled:bg-gray-100 dark:disabled:bg-gray-600 transition" />
                </div>

                {editing && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                      type="submit" 
                      disabled={saveLoading}
                      className="py-3 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {saveLoading ? "💾 Saving..." : "💾 Save Health Info"}
                    </button>
                    <button 
                      type="button"
                      onClick={handlePersonalSubmit}
                      disabled={saveLoading}
                      className="py-3 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200">
                      {saveLoading ? "💾 Saving..." : "💾 Save Personal Info"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </form>
        )}

        {activeTab === "health" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-gray-900/70 p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">➕ Add Health Record</h2>
              <form onSubmit={addHealthRecord} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" value={newRecord.record_type} onChange={(e) => setNewRecord({ ...newRecord, record_type: e.target.value })} placeholder="Record Type (BP, Weight, etc)" className="px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition" />
                  <input type="text" value={newRecord.record_value} onChange={(e) => setNewRecord({ ...newRecord, record_value: e.target.value })} placeholder="Value" className="px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition" />
                </div>
                <button type="submit" className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold">Add Record</button>
              </form>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-gray-900/70 p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">📊 Health Records</h2>
              {healthRecords.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">No records yet.</p>
              ) : (
                <div className="space-y-4">
                  {healthRecords.map((record) => (
                    <div key={record.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-200 gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 dark:text-white">{record.record_type}</p>
                        <p className="text-lg text-purple-600 dark:text-purple-400 font-bold">{record.record_value}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(record.record_date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <button 
                          onClick={() => handleViewDetails(record)} 
                          className="px-3 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg text-sm hover:shadow-lg transition-all duration-200"
                        >
                          👁️ Details
                        </button>
                        <button 
                          onClick={() => handleDownload(record)} 
                          className="px-3 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg text-sm hover:shadow-lg transition-all duration-200"
                        >
                          📥 Download
                        </button>
                        <button 
                          onClick={() => deleteRecord(record.id)} 
                          className="px-3 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg text-sm hover:shadow-lg transition-all duration-200"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal for viewing details */}
        {showModal && selectedRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl dark:shadow-gray-900/90 max-w-md w-full p-8 border-2 border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">📋 Record Details</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white text-2xl font-bold transition"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Record Type</label>
                  <p className="text-lg font-bold text-gray-800 dark:text-white">{selectedRecord.record_type}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Value</label>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{selectedRecord.record_value}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Date</label>
                  <p className="text-base text-gray-800 dark:text-white">{new Date(selectedRecord.record_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                {selectedRecord.notes && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Notes</label>
                    <p className="text-base text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">{selectedRecord.notes}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Record ID</label>
                  <p className="text-sm text-gray-500 dark:text-gray-500 font-mono">{selectedRecord.id}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => {
                    handleDownload(selectedRecord);
                    setShowModal(false);
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white rounded-lg hover:shadow-lg font-semibold transition-all duration-200"
                >
                  📥 Download
                </button>
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
