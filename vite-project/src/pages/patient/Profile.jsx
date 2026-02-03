import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Authcontext/AuthContext";
import { patientAPI, healthRecordAPI } from "../../api/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
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

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p>Loading...</p></div>;

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-white border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition font-semibold"
        >
          ← Back
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-dark mb-2">👤 My Profile</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
            {activeTab === "profile" && (
              <button
                onClick={() => setEditing(!editing)}
                className="px-6 py-2 bg-accent text-white rounded-lg hover:opacity-90"
              >
                {editing ? "Cancel" : "✏️ Edit"}
              </button>
            )}
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes("✓") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}

        <div className="flex gap-4 mb-6 border-b border-gray-300">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-3 font-semibold ${
              activeTab === "profile" ? "border-b-2 border-accent text-accent" : "text-gray-600"
            }`}
          >
            Profile Info
          </button>
          <button
            onClick={() => setActiveTab("health")}
            className={`px-4 py-3 font-semibold ${
              activeTab === "health" ? "border-b-2 border-accent text-accent" : "text-gray-600"
            }`}
          >
            Health Records
          </button>
        </div>

        {activeTab === "profile" && (
          <form onSubmit={editing ? handlePersonalSubmit : null} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <div className="border-b pb-6">
              <h2 className="text-2xl font-bold text-dark mb-6">👤 Personal Information</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">👤 Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={personalData.name} 
                    onChange={handlePersonalChange} 
                    disabled={!editing} 
                    placeholder="Your name" 
                    className="w-full px-4 py-2 border rounded disabled:bg-gray-100" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">📧 Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={personalData.email} 
                    onChange={handlePersonalChange} 
                    disabled={!editing} 
                    placeholder="your@email.com" 
                    className="w-full px-4 py-2 border rounded disabled:bg-gray-100" 
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-dark mb-2">📞 Phone</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={personalData.phone} 
                    onChange={handlePersonalChange} 
                    disabled={!editing} 
                    placeholder="+1234567890" 
                    className="w-full px-4 py-2 border rounded disabled:bg-gray-100" 
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-dark mb-6">🏥 Health Information</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">🩸 Blood Type</label>
                    <input type="text" name="blood_type" value={formData.blood_type} onChange={handleChange} disabled={!editing} placeholder="O+" className="w-full px-4 py-2 border rounded disabled:bg-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} disabled={!editing} className="w-full px-4 py-2 border rounded disabled:bg-gray-100">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">📅 DOB</label>
                    <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} disabled={!editing} className="w-full px-4 py-2 border rounded disabled:bg-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">📞 Emergency Phone</label>
                    <input type="tel" name="emergency_phone" value={formData.emergency_phone} onChange={handleChange} disabled={!editing} placeholder="+1234567890" className="w-full px-4 py-2 border rounded disabled:bg-gray-100" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">👥 Emergency Contact</label>
                  <input type="text" name="emergency_contact" value={formData.emergency_contact} onChange={handleChange} disabled={!editing} placeholder="Contact name" className="w-full px-4 py-2 border rounded disabled:bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">📋 Medical History</label>
                  <textarea name="medical_history" value={formData.medical_history} onChange={handleChange} disabled={!editing} placeholder="Any past conditions..." rows="3" className="w-full px-4 py-2 border rounded disabled:bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">⚠️ Allergies</label>
                  <textarea name="allergies" value={formData.allergies} onChange={handleChange} disabled={!editing} placeholder="Any allergies..." rows="3" className="w-full px-4 py-2 border rounded disabled:bg-gray-100" />
                </div>

                {editing && (
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="submit" 
                      disabled={saveLoading}
                      className="py-3 bg-primary text-dark font-bold rounded hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition"
                    >
                      {saveLoading ? "💾 Saving..." : "💾 Save Health Info"}
                    </button>
                    <button 
                      type="button"
                      onClick={handlePersonalSubmit}
                      disabled={saveLoading}
                      className="py-3 bg-accent text-white font-bold rounded hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition">
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
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-xl font-bold text-dark mb-6">➕ Add Health Record</h2>
              <form onSubmit={addHealthRecord} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" value={newRecord.record_type} onChange={(e) => setNewRecord({ ...newRecord, record_type: e.target.value })} placeholder="Record Type (BP, Weight, etc)" className="px-4 py-2 border rounded" />
                  <input type="text" value={newRecord.record_value} onChange={(e) => setNewRecord({ ...newRecord, record_value: e.target.value })} placeholder="Value" className="px-4 py-2 border rounded" />
                </div>
                <button type="submit" className="w-full py-2 bg-accent text-white rounded hover:opacity-90">Add Record</button>
              </form>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-xl font-bold text-dark mb-6">📊 Health Records</h2>
              {healthRecords.length === 0 ? (
                <p className="text-gray-600">No records yet.</p>
              ) : (
                <div className="space-y-4">
                  {healthRecords.map((record) => (
                    <div key={record.id} className="flex justify-between items-center p-4 border rounded hover:bg-gray-50 transition">
                      <div className="flex-1">
                        <p className="font-semibold">{record.record_type}</p>
                        <p className="text-lg text-primary font-bold">{record.record_value}</p>
                        <p className="text-sm text-gray-500">{new Date(record.record_date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleViewDetails(record)} 
                          className="px-3 py-2 bg-accent text-white rounded text-sm hover:opacity-90 transition"
                        >
                          👁️ Details
                        </button>
                        <button 
                          onClick={() => handleDownload(record)} 
                          className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:opacity-90 transition"
                        >
                          📥 Download
                        </button>
                        <button 
                          onClick={() => deleteRecord(record.id)} 
                          className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:opacity-90 transition"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-dark">📋 Record Details</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-dark text-2xl font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Record Type</label>
                  <p className="text-lg font-bold text-dark">{selectedRecord.record_type}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Value</label>
                  <p className="text-2xl font-bold text-secondary">{selectedRecord.record_value}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Date</label>
                  <p className="text-base text-dark">{new Date(selectedRecord.record_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                {selectedRecord.notes && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Notes</label>
                    <p className="text-base text-dark bg-gray-50 p-3 rounded">{selectedRecord.notes}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Record ID</label>
                  <p className="text-sm text-gray-500 font-mono">{selectedRecord.id}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => {
                    handleDownload(selectedRecord);
                    setShowModal(false);
                  }}
                  className="flex-1 py-2 bg-accent text-white rounded-lg hover:opacity-90 font-semibold transition"
                >
                  📥 Download
                </button>
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 bg-gray-200 text-dark rounded-lg hover:bg-gray-300 font-semibold transition"
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
