import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { prescriptionAPI } from "../../api/api";

export default function Prescriptions() {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      console.log("📤 [USER PRESCRIPTIONS] Fetching user prescriptions from API...");
      const response = await prescriptionAPI.getPrescriptions();
      console.log("✅ [USER PRESCRIPTIONS] Prescriptions received from backend:", response.data);
      setPrescriptions(response.data.prescriptions || response.data || []);
    } catch (error) {
      console.error("❌ [USER PRESCRIPTIONS] Error loading prescriptions:", error);
      setMessage("Error loading prescriptions: " + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center"><p className="text-gray-700 dark:text-gray-300">Loading prescriptions...</p></div>;

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-white dark:bg-gray-800 border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white dark:hover:bg-accent transition font-semibold text-sm"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-dark mb-2">💊 My Prescriptions</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">View all your current and past prescriptions</p>

        {message && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
            {message}
          </div>
        )}

        {prescriptions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow dark:shadow-gray-900/50 text-center">
            <div className="text-5xl mb-4">💊</div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">No prescriptions yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your prescriptions from doctors will appear here</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {prescriptions.map((prescription) => (
              <div key={prescription.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 p-6 border-l-4 border-secondary">
                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Doctor</p>
                    <p className="font-bold text-dark text-lg">{prescription.doctor_name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Date Prescribed</p>
                    <p className="font-bold text-dark text-lg">
                      {new Date(prescription.prescribed_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-background dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">💊 Medication</p>
                    <p className="font-semibold text-dark">{prescription.medication_name || "N/A"}</p>
                  </div>
                  <div className="bg-background dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">📏 Dosage</p>
                    <p className="font-semibold text-dark">{prescription.dosage || "N/A"}</p>
                  </div>
                  <div className="bg-background dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">⏱️ Duration</p>
                    <p className="font-semibold text-dark">{prescription.duration || "N/A"}</p>
                  </div>
                </div>

                {prescription.instructions && (
                  <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-500 rounded">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">📝 Instructions</p>
                    <p className="text-gray-700 dark:text-gray-300">{prescription.instructions}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                    prescription.status === "active" ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" :
                    prescription.status === "expired" ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300" :
                    "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300"
                  }`}>
                    {(prescription.status || "pending").toUpperCase()}
                  </span>
                  <button className="px-4 py-2 bg-accent dark:bg-purple-700 text-white rounded-lg hover:opacity-90 dark:hover:bg-purple-600 text-sm font-semibold transition">
                    📥 Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
