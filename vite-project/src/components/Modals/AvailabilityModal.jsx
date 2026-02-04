import { useState, useEffect } from "react";
import { availabilityAPI } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

export default function AvailabilityModal({ isOpen, onClose, onSuccess }) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [currentStatus, setCurrentStatus] = useState("available");
  const [newStatus, setNewStatus] = useState("available");
  const [reason, setReason] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [activeTab, setActiveTab] = useState("status");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchAvailability();
    }
  }, [isOpen]);

  const fetchAvailability = async () => {
    try {
      // Get current doctor availability
      const response = await availabilityAPI.getAvailabilityHistory();
      if (response.data.history && response.data.history[0]) {
        setCurrentStatus(response.data.history[0].status);
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!newStatus) {
      setMessage("Please select a status");
      return;
    }

    try {
      setLoading(true);
      await availabilityAPI.updateAvailabilityStatus({
        status: newStatus,
        reason: reason || null,
        end_date: endDate || null,
      });
      setMessage("✓ Availability status updated!");
      setCurrentStatus(newStatus);
      setTimeout(() => {
        onSuccess?.(newStatus);
      }, 1500);
    } catch (error) {
      setMessage("✗ Error: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">⚙️ Manage Availability</h2>
            <button
              onClick={onClose}
              className="text-white hover:opacity-80 text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b dark:border-gray-700">
          <button
            onClick={() => setActiveTab("status")}
            className={`flex-1 py-3 font-semibold transition ${
              activeTab === "status"
                ? "text-accent border-b-2 border-accent"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            Status
          </button>
          <button
            onClick={() => setActiveTab("slots")}
            className={`flex-1 py-3 font-semibold transition ${
              activeTab === "slots"
                ? "text-accent border-b-2 border-accent"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            Time Slots
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {message && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              message.includes("✓") ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
            }`}>
              {message}
            </div>
          )}

          {activeTab === "status" && (
            <form onSubmit={handleStatusUpdate} className="space-y-4">
              {/* Current Status */}
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Status:</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-300 capitalize">{currentStatus}</p>
              </div>

              {/* New Status */}
              <div>
                <label className="block text-sm font-semibold text-dark dark:text-gray-300 mb-2">
                  Change Status To
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                >
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="on_leave">On Leave</option>
                </select>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-semibold text-dark dark:text-gray-300 mb-2">
                  Reason (Optional)
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Emergency, Conference, Vacation"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>

              {/* End Date (for on_leave) */}
              {newStatus === "on_leave" && (
                <div>
                  <label className="block text-sm font-semibold text-dark dark:text-gray-300 mb-2">
                    Return Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t dark:border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 border-2 border-gray-300 dark:border-gray-600 text-dark dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Updating..." : "✓ Update Status"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "slots" && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">Manage your time slots for appointments</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Set your weekly availability schedule</p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  navigate("/doctor/time-slots");
                }}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition font-semibold"
              >
                ⏰ Manage Time Slots →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
