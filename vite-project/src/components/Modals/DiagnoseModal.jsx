import { useState } from "react";
import { diagnosisAPI } from "../../api/api";

export default function DiagnoseModal({ isOpen, appointmentId, patientId, onClose, onSuccess }) {
  const [diagnosis, setDiagnosis] = useState("");
  const [icdCode, setIcdCode] = useState("");
  const [severity, setSeverity] = useState("mild");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!diagnosis.trim()) {
      setMessage("Please enter a diagnosis");
      return;
    }

    try {
      setLoading(true);
      await diagnosisAPI.createDiagnosis({
        appointment_id: appointmentId,
        patient_id: patientId,
        diagnosis,
        icd_code: icdCode || null,
        severity,
        notes: notes || null,
      });
      setMessage("✓ Diagnosis added successfully!");
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
        <div className="bg-gradient-to-r from-purple-600 to-accent p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">🔍 Add Diagnosis</h2>
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

          {/* Diagnosis */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">
              Diagnosis *
            </label>
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Enter the diagnosis..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none"
              rows="3"
            />
          </div>

          {/* ICD Code and Severity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                ICD Code (Optional)
              </label>
              <input
                type="text"
                value={icdCode}
                onChange={(e) => setIcdCode(e.target.value)}
                placeholder="e.g., E11.9"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              >
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">
              Clinical Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional clinical notes..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none"
              rows="3"
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
              className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:opacity-90 transition font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "✓ Save Diagnosis"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
