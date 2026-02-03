import { useState } from "react";
import { consultationNotesAPI } from "../../api/api";

export default function AddNotesModal({ isOpen, appointmentId, patientId, onClose, onSuccess }) {
  const [notes, setNotes] = useState("");
  const [observations, setObservations] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [vitals, setVitals] = useState({
    bloodPressure: "",
    temperature: "",
    heartRate: "",
    respiratoryRate: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleVitalsChange = (field, value) => {
    setVitals(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!notes.trim()) {
      setMessage("Please enter consultation notes");
      return;
    }

    try {
      setLoading(true);
      await consultationNotesAPI.createConsultationNotes({
        appointment_id: appointmentId,
        patient_id: patientId,
        notes,
        vitals: Object.values(vitals).some(v => v) ? vitals : null,
        observations,
        follow_up: followUp,
      });
      setMessage("✓ Notes added successfully!");
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
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-secondary to-accent p-6 sticky top-0">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">📝 Add Consultation Notes</h2>
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

          {/* Consultation Notes */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">
              Consultation Notes *
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter your consultation notes here..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none"
              rows="4"
            />
          </div>

          {/* Vitals Section */}
          <div className="bg-background p-4 rounded-lg">
            <h3 className="font-semibold text-dark mb-3">📊 Vital Signs (Optional)</h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Blood Pressure (e.g., 120/80)"
                value={vitals.bloodPressure}
                onChange={(e) => handleVitalsChange("bloodPressure", e.target.value)}
                className="p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-accent"
              />
              <input
                type="text"
                placeholder="Temperature (°F)"
                value={vitals.temperature}
                onChange={(e) => handleVitalsChange("temperature", e.target.value)}
                className="p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-accent"
              />
              <input
                type="text"
                placeholder="Heart Rate (bpm)"
                value={vitals.heartRate}
                onChange={(e) => handleVitalsChange("heartRate", e.target.value)}
                className="p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-accent"
              />
              <input
                type="text"
                placeholder="Respiratory Rate"
                value={vitals.respiratoryRate}
                onChange={(e) => handleVitalsChange("respiratoryRate", e.target.value)}
                className="p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Observations */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">
              Observations (Optional)
            </label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Additional observations..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none"
              rows="2"
            />
          </div>

          {/* Follow Up */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">
              Follow-up Instructions (Optional)
            </label>
            <textarea
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              placeholder="Follow-up instructions for patient..."
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
              className="flex-1 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "✓ Save Notes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
