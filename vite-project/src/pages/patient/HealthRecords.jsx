import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { healthRecordAPI } from "../../api/api";

export default function HealthRecords() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchHealthRecords();
  }, []);

  const fetchHealthRecords = async () => {
    try {
      setLoading(true);
      console.log("📤 [USER HEALTH RECORDS] Fetching user health records from API...");
      const response = await healthRecordAPI.getHealthRecords();
      console.log("✅ [USER HEALTH RECORDS] Health records received from backend:", response.data);
      setRecords(response.data.records || response.data || []);
    } catch (error) {
      console.error("❌ [USER HEALTH RECORDS] Error loading health records:", error);
      setMessage("Error loading health records: " + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p>Loading health records...</p></div>;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-white border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition font-semibold text-sm"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-dark mb-2">📊 My Health Records</h1>
        <p className="text-gray-600 mb-6">View your complete health history and medical records</p>

        {message && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {message}
          </div>
        )}

        {records.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-gray-600 mb-4">No health records yet</p>
            <p className="text-sm text-gray-500">Your health records and test results will appear here</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {records.map((record) => (
              <div key={record.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-accent hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-dark">{record.record_type || "Medical Record"}</h3>
                    <p className="text-sm text-gray-600">
                      📅 {new Date(record.record_date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    ✓ Recorded
                  </span>
                </div>

                <div className="bg-background p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-600 mb-2">Value</p>
                  <p className="text-2xl font-bold text-secondary">{record.record_value || "N/A"}</p>
                </div>

                {record.notes && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">📝 Notes</p>
                    <p className="text-gray-700">{record.notes}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 text-sm font-semibold">
                    👁️ View Details
                  </button>
                  <button className="px-4 py-2 bg-background border-2 border-accent text-accent rounded-lg hover:bg-gray-100 text-sm font-semibold">
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
