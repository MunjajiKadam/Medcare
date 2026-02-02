import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Authcontext/AuthContext";
import { patientAPI, healthRecordAPI } from "../../api/api";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("📤 [USER PROFILE] Updating patient profile with data:", formData);
      await patientAPI.updatePatientProfile(formData);
      console.log("✅ [USER PROFILE] Profile updated successfully");
      setMessage("✓ Profile updated!");
      setEditing(false);
      fetchData();
    } catch (error) {
      console.error("❌ [USER PROFILE] Error updating profile:", error);
      setMessage("✗ Error: " + error.response?.data?.message);
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
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
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
            {editing && <button type="submit" className="w-full py-3 bg-primary text-dark font-bold rounded hover:opacity-90">💾 Save Changes</button>}
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
                    <div key={record.id} className="flex justify-between items-center p-4 border rounded hover:bg-gray-50">
                      <div>
                        <p className="font-semibold">{record.record_type}</p>
                        <p className="text-lg text-primary font-bold">{record.record_value}</p>
                        <p className="text-sm text-gray-500">{new Date(record.record_date).toLocaleDateString()}</p>
                      </div>
                      <button onClick={() => deleteRecord(record.id)} className="px-4 py-2 bg-red-500 text-white rounded hover:opacity-90">🗑️ Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
