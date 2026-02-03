import { useState } from "react";
import { prescriptionAPI } from "../../api/api";

export default function PrescribeModal({ isOpen, appointmentId, patientId, onClose, onSuccess }) {
  const [medications, setMedications] = useState("");
  const [dosage, setDosage] = useState("");
  const [duration, setDuration] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!medications.trim()) {
      setMessage("Please enter medications");
      return;
    }

    try {
      setLoading(true);
      await prescriptionAPI.createPrescription({
        appointment_id: appointmentId,
        patient_id: patientId,
        medications,
        dosage: dosage || null,
        duration: duration || null,
        instructions: instructions || null,
      });
      setMessage("✓ Prescription created successfully!");
      setTimeout(() => {
        onClose();
        onSuccess();
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
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">💊 Create Prescription</h2>
            <button
              onClick={onClose}
              className="text-white hover:opacity-80 text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.includes("✓") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {message}
            </div>
          )}

          {/* Medications */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">
              Medications *
            </label>
            <textarea
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              placeholder="List all medications (separated by comma or new line)..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none"
              rows="3"
            />
          </div>

          {/* Dosage */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">
              Dosage (Optional)
            </label>
            <input
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="e.g., 500mg tablets"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">
              Duration (Optional)
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 7 days, 2 weeks"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">
              Instructions (Optional)
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Take with food, avoid alcohol, etc..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none"
              rows="2"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border-2 border-gray-300 text-dark rounded-lg hover:bg-gray-100 transition font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:opacity-90 transition font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "✓ Create Prescription"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
