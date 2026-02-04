import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { timeSlotAPI, availabilityAPI } from "../../api/api";
import { useAuth } from "../../Authcontext/AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { formatTimeRange } from "../../utils/timeFormat";

export default function TimeSlots() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    day_of_week: "Monday",
    start_time: "",
    end_time: "",
    is_available: true,
  });

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  const fetchTimeSlots = async () => {
    try {
      setLoading(true);
      const response = await timeSlotAPI.getTimeSlots();
      console.log("Time slots response:", response.data);
      setTimeSlots(response.data.slots || []);
    } catch (error) {
      console.error("Error fetching time slots:", error);
      setMessage("Error: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAddTimeSlot = async (e) => {
    e.preventDefault();
    
    if (!formData.start_time || !formData.end_time) {
      setMessage("❌ Please fill in all fields");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    // Validate that end time is after start time
    if (formData.start_time >= formData.end_time) {
      setMessage("❌ End time must be after start time");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      await availabilityAPI.upsertTimeSlot(formData);
      setMessage("✓ Time slot added successfully! You can add another slot for the same day if needed.");
      setShowAddModal(false);
      // Keep the same day selected for easy addition of multiple slots
      setFormData({
        day_of_week: formData.day_of_week,
        start_time: "",
        end_time: "",
        is_available: true,
      });
      fetchTimeSlots();
      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      setMessage("✗ Error: " + (error.response?.data?.message || error.message));
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const handleToggleAvailability = async (slotId, currentStatus) => {
    try {
      await availabilityAPI.toggleTimeSlotAvailability(slotId, {
        is_available: !currentStatus,
      });
      setMessage("✓ Slot availability updated!");
      fetchTimeSlots();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("✗ Error: " + (error.response?.data?.message || error.message));
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (confirm("Are you sure you want to delete this time slot?")) {
      try {
        await availabilityAPI.deleteTimeSlot(slotId);
        setMessage("✓ Time slot deleted!");
        fetchTimeSlots();
        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        setMessage("✗ Error: " + (error.response?.data?.message || error.message));
        setTimeout(() => setMessage(""), 3000);
      }
    }
  };

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await logout();
      navigate("/login");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
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

          <h1 className="text-3xl font-bold text-dark mb-2">⏰ Manage Time Slots</h1>
          <p className="text-gray-600 mb-6">Set your weekly availability schedule for appointments</p>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes("✓") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {message}
            </div>
          )}

          {/* Add Time Slot Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="mb-6 px-6 py-3 bg-accent text-white rounded-lg hover:opacity-90 transition font-semibold"
          >
            + Add New Time Slot
          </button>

          {/* Time Slots Grid */}
          {loading ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p>Loading time slots...</p>
            </div>
          ) : timeSlots.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-600 mb-4">No time slots added yet</p>
              <p className="text-sm text-gray-500">Click "Add New Time Slot" to set your availability</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {daysOfWeek.map((day) => {
                const daySlots = timeSlots.filter(slot => slot.day_of_week === day);
                
                return (
                  <div key={day} className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-dark">{day}</h3>
                      {daySlots.length > 0 && (
                        <span className="text-sm bg-accent text-white px-3 py-1 rounded-full font-semibold">
                          {daySlots.length} slot{daySlots.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    
                    {daySlots.length === 0 ? (
                      <p className="text-gray-500 text-sm">No slots set for this day</p>
                    ) : (
                      <div className="space-y-3">
                        {daySlots.map((slot, index) => (
                          <div
                            key={slot.id}
                            className="flex items-center justify-between p-4 bg-background rounded-lg border-l-4 border-accent"
                          >
                            <div className="flex items-center gap-4">
                              <div>
                                <p className="font-semibold text-dark text-lg">
                                  🕐 {formatTimeRange(slot.start_time, slot.end_time)}
                                </p>
                                <p className={`text-sm ${
                                  slot.is_available ? "text-green-600" : "text-red-600"
                                }`}>
                                  {slot.is_available ? "✓ Available" : "✗ Unavailable"}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleToggleAvailability(slot.id, slot.is_available)}
                                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                                  slot.is_available
                                    ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                    : "bg-green-100 text-green-700 hover:bg-green-200"
                                }`}
                              >
                                {slot.is_available ? "Disable" : "Enable"}
                              </button>
                              <button
                                onClick={() => handleDeleteSlot(slot.id)}
                                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-semibold text-sm transition"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Add Time Slot Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-2xl font-bold text-white">Add Time Slot</h2>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="text-white hover:opacity-80 text-2xl"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-blue-100 text-sm">💡 You can add multiple time slots for the same day</p>
                </div>

                <form onSubmit={handleAddTimeSlot} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Day of Week
                    </label>
                    <select
                      value={formData.day_of_week}
                      onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                    >
                      {daysOfWeek.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_available"
                      checked={formData.is_available}
                      onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="is_available" className="text-sm text-dark">
                      Available for appointments
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 py-2 border-2 border-gray-300 text-dark rounded-lg hover:bg-gray-100 transition font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition font-semibold"
                    >
                      Add Slot
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
