import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { timeSlotAPI } from "../../api/api";
import { useAuth } from "../../Authcontext/AuthContext";

export default function TimeSlots() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await logout();
      navigate("/admin/login");
    }
  };
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  const fetchTimeSlots = async () => {
    try {
      setLoading(true);
      console.log("📤 [ADMIN TIME SLOTS] Fetching time slots from API...");
      const response = await timeSlotAPI.getAllTimeSlotsAdmin();
      console.log("✅ [ADMIN TIME SLOTS] Time slots received from backend:", response.data);
      setTimeSlots(response.data.slots || response.data || []);
    } catch (error) {
      console.error("❌ [ADMIN TIME SLOTS] Error loading time slots:", error);
      setMessage("Error: " + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteTimeSlot = async (id) => {
    if (confirm("Are you sure you want to delete this time slot?")) {
      try {
        console.log(`📤 [ADMIN TIME SLOTS] Deleting time slot ID: ${id}`);
        await timeSlotAPI.deleteTimeSlotAdmin(id);
        console.log("✅ [ADMIN TIME SLOTS] Time slot deleted successfully");
        setMessage("✓ Time slot deleted!");
        fetchTimeSlots();
      } catch (error) {
        console.error("❌ [ADMIN TIME SLOTS] Error deleting time slot:", error);
        setMessage("✗ Error: " + error.response?.data?.message);
      }
    }
  };

  const filteredTimeSlots = timeSlots.filter(slot =>
    (slot.doctor_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (slot.day_of_week || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center"><p className="text-gray-700 dark:text-gray-300">Loading time slots...</p></div>;

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white dark:hover:bg-accent transition font-semibold text-sm"
          >
            ← Back
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition font-semibold text-sm flex items-center gap-2"
          >
            <span>🚪</span>
            Logout
          </button>
        </div>

        <h1 className="text-3xl font-bold text-dark mb-2">⏰ Doctor Time Slots</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Manage doctor availability and time slots</p>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes("✓") ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"}`}>
            {message}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 p-6 mb-6">
          <input
            type="text"
            placeholder="Search by doctor name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-accent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
        </div>

        {filteredTimeSlots.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 p-6 text-center text-gray-500 dark:text-gray-400">
            No time slots found
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700 border-b dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-dark dark:text-gray-200">Doctor</th>
                  <th className="px-6 py-3 text-left font-semibold text-dark dark:text-gray-200">Day</th>
                  <th className="px-6 py-3 text-left font-semibold text-dark dark:text-gray-200">Start Time</th>
                  <th className="px-6 py-3 text-left font-semibold text-dark dark:text-gray-200">End Time</th>
                  <th className="px-6 py-3 text-left font-semibold text-dark dark:text-gray-200">Status</th>
                  <th className="px-6 py-3 text-center font-semibold text-dark dark:text-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTimeSlots.map((slot, idx) => (
                  <tr key={idx} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 font-semibold text-dark dark:text-gray-200">{slot.doctor_name || "N/A"}</td>
                    <td className="px-6 py-4 dark:text-gray-300">{slot.day_of_week || "N/A"}</td>
                    <td className="px-6 py-4 dark:text-gray-300">{slot.start_time || "N/A"}</td>
                    <td className="px-6 py-4 dark:text-gray-300">{slot.end_time || "N/A"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        slot.is_available ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                      }`}>
                        {slot.is_available ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => deleteTimeSlot(slot.id)}
                        className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 text-gray-600 dark:text-gray-300 text-sm">
          Total Time Slots: <span className="font-bold text-dark dark:text-white">{filteredTimeSlots.length}</span>
        </div>
      </div>
    </div>
  );
}
