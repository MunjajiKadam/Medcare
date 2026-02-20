import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doctorAPI } from "../../api/api";
import { useAuth } from "../../Authcontext/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Doctors() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme } = useTheme();
  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await logout();
      navigate("/admin/login");
    }
  };
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      console.log("📤 [ADMIN DOCTORS] Fetching doctors from API...");
      const response = await doctorAPI.getAllDoctors();
      console.log("✅ [ADMIN DOCTORS] Doctors received from backend:", response.data);
      setDoctors(response.data.doctors || []);
    } catch (error) {
      console.error("❌ [ADMIN DOCTORS] Error loading doctors:", error);
      setMessage("Error: " + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteDoctor = async (id, name) => {
    if (confirm(`Are you sure you want to delete Dr. ${name}? This action cannot be undone.`)) {
      try {
        console.log(`📤 [ADMIN DOCTORS] Deleting doctor ID: ${id}`);
        await doctorAPI.deleteDoctorAdmin(id);
        console.log("✅ [ADMIN DOCTORS] Doctor deleted successfully");
        setMessage("✓ Doctor deleted successfully!");
        setTimeout(() => setMessage(""), 3000);
        fetchDoctors();
      } catch (error) {
        console.error("❌ [ADMIN DOCTORS] Error deleting doctor:", error);
        setMessage("✗ Error: " + error.response?.data?.message);
        setTimeout(() => setMessage(""), 3000);
      }
    }
  };

  const viewDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const filteredDoctors = doctors.filter(d =>
    (d.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.specialization || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center"><p className="text-gray-700 dark:text-gray-300">Loading doctors...</p></div>;

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 p-6 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition font-semibold text-sm"
          >
            ← Back
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold text-sm flex items-center gap-2"
          >
            <span>🚪</span>
            Logout
          </button>
        </div>

        <h1 className="text-3xl font-bold text-dark dark:text-white mb-2">👨‍⚕️ Manage Doctors</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Manage all registered doctors</p>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes("✓") ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"}`}>
            {message}
          </div>
        )}

        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search by name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-3 border-2 border-accent dark:border-gray-600 rounded-lg focus:outline-none bg-white dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          />
        </div>

        {filteredDoctors.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow text-center">
            <p className="text-gray-600 dark:text-gray-400">No doctors found.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-secondary text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Specialization</th>
                  <th className="px-6 py-3 text-left">Experience</th>
                  <th className="px-6 py-3 text-left">Fee</th>
                  <th className="px-6 py-3 text-left">Rating</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map((doctor, idx) => (
                  <tr key={idx} className="border-b dark:border-gray-700 hover:bg-background dark:hover:bg-gray-700 transition">
                    <td className="px-6 py-4 font-semibold text-dark dark:text-white flex items-center gap-3">
                      <img
                        src={doctor.profile_image || "https://ui-avatars.com/api/?name=" + encodeURIComponent(doctor.name || "Doctor") + "&background=random"}
                        alt={doctor.name || "Doctor"}
                        className="w-10 h-10 rounded-full object-cover border-2 border-purple-400 bg-gray-100 dark:bg-gray-700"
                        onError={e => { e.target.onerror = null; e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(doctor.name || "Doctor") + "&background=random"; }}
                      />
                      {doctor.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 dark:text-gray-300">{doctor.specialization || "N/A"}</td>
                    <td className="px-6 py-4 dark:text-gray-300">{doctor.experience_years || 0} years</td>
                    <td className="px-6 py-4 dark:text-gray-300">${doctor.consultation_fee || 0}</td>
                    <td className="px-6 py-4 dark:text-gray-300">{doctor.rating || 0} ⭐</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button 
                          onClick={() => viewDoctor(doctor)}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => deleteDoctor(doctor.id, doctor.name)}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">Total Doctors: {filteredDoctors.length}</p>
      </div>

      {/* View Doctor Modal */}
      {showModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-accent p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">👨‍⚕️ Doctor Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:opacity-80 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 mb-2 md:col-span-2">
                  <img
                    src={selectedDoctor.profile_image || "https://ui-avatars.com/api/?name=" + encodeURIComponent(selectedDoctor.name || "Doctor") + "&background=random"}
                    alt={selectedDoctor.name || "Doctor"}
                    className="w-16 h-16 rounded-full object-cover border-2 border-purple-400 bg-gray-100 dark:bg-gray-700"
                    onError={e => { e.target.onerror = null; e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(selectedDoctor.name || "Doctor") + "&background=random"; }}
                  />
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Name</label>
                    <p className="text-dark dark:text-white font-semibold">{selectedDoctor.name || "N/A"}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Email</label>
                  <p className="text-dark dark:text-white">{selectedDoctor.email || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Phone</label>
                  <p className="text-dark dark:text-white">{selectedDoctor.phone || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Specialization</label>
                  <p className="text-dark dark:text-white">{selectedDoctor.specialization || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Experience</label>
                  <p className="text-dark dark:text-white">{selectedDoctor.experience_years || 0} years</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Consultation Fee</label>
                  <p className="text-dark dark:text-white">${selectedDoctor.consultation_fee || 0}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Rating</label>
                  <p className="text-dark dark:text-white">{selectedDoctor.rating || 0} ⭐</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Qualifications</label>
                  <p className="text-dark dark:text-white">{selectedDoctor.qualifications || "N/A"}</p>
                </div>
              </div>
              
              {selectedDoctor.bio && (
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Bio</label>
                  <p className="text-dark dark:text-white">{selectedDoctor.bio}</p>
                </div>
              )}
              
              <div className="pt-4 border-t dark:border-gray-700">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-2 bg-accent text-white rounded-lg hover:opacity-90 transition font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
