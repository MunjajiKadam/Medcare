import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doctorAPI } from "../../api/api";
import { useAuth } from "../../Authcontext/AuthContext";

export default function Doctors() {
  const navigate = useNavigate();
  const { logout } = useAuth();
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

  const filteredDoctors = doctors.filter(d =>
    (d.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.specialization || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p>Loading doctors...</p></div>;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition font-semibold text-sm"
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

        <h1 className="text-3xl font-bold text-dark mb-2">👨‍⚕️ Manage Doctors</h1>
        <p className="text-gray-600 mb-6">Manage all registered doctors</p>

        {message && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {message}
          </div>
        )}

        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search by name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-3 border-2 border-accent rounded-lg focus:outline-none bg-white"
          />
        </div>

        {filteredDoctors.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600">No doctors found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
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
                  <tr key={idx} className="border-b hover:bg-background transition">
                    <td className="px-6 py-4 font-semibold text-dark">{doctor.name || "N/A"}</td>
                    <td className="px-6 py-4">{doctor.specialization || "N/A"}</td>
                    <td className="px-6 py-4">{doctor.experience_years || 0} years</td>
                    <td className="px-6 py-4">${doctor.consultation_fee || 0}</td>
                    <td className="px-6 py-4">{doctor.rating || 0} ⭐</td>
                    <td className="px-6 py-4 text-center">
                      <button className="px-4 py-2 bg-accent text-white rounded hover:opacity-90 text-sm">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-6 text-center text-gray-600">Total Doctors: {filteredDoctors.length}</p>
      </div>
    </div>
  );
}
