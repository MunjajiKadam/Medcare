import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { timeSlotAPI } from "../../api/api";

export default function TimeSlots() {
  const navigate = useNavigate();
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
      // Note: This endpoint might need adjustment based on your backend
      const response = await timeSlotAPI.getTimeSlots("all");
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
        await timeSlotAPI.deleteTimeSlot(id);
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

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p>Loading time slots...</p></div>;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-white border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition font-semibold text-sm"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-dark mb-2">⏰ Doctor Time Slots</h1>
        <p className="text-gray-600 mb-6">Manage doctor availability and time slots</p>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes("✓") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <input
            type="text"
            placeholder="Search by doctor name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
          />
        </div>

        {filteredTimeSlots.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-6 text-center text-gray-500">
            No time slots found
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-dark">Doctor</th>
                  <th className="px-6 py-3 text-left font-semibold text-dark">Day</th>
                  <th className="px-6 py-3 text-left font-semibold text-dark">Start Time</th>
                  <th className="px-6 py-3 text-left font-semibold text-dark">End Time</th>
                  <th className="px-6 py-3 text-left font-semibold text-dark">Status</th>
                  <th className="px-6 py-3 text-center font-semibold text-dark">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTimeSlots.map((slot, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-dark">{slot.doctor_name || "N/A"}</td>
                    <td className="px-6 py-4">{slot.day_of_week || "N/A"}</td>
                    <td className="px-6 py-4">{slot.start_time || "N/A"}</td>
                    <td className="px-6 py-4">{slot.end_time || "N/A"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        slot.is_available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {slot.is_available ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => deleteTimeSlot(slot.id)}
                        className="text-red-500 hover:text-red-700 font-semibold"
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

        <div className="mt-6 text-gray-600 text-sm">
          Total Time Slots: <span className="font-bold text-dark">{filteredTimeSlots.length}</span>
        </div>
      </div>
    </div>
  );
}
