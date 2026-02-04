import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { healthRecordAPI } from "../../api/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function HealthRecords() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const handleViewDetails = (record) => {
    console.log("👁️ [USER HEALTH RECORDS] Viewing details for record:", record);
    setSelectedRecord(record);
    setShowModal(true);
  };

  const handleDownload = (record) => {
    console.log("📥 [USER HEALTH RECORDS] Downloading record:", record);
    try {
      // Create a text content for the record
      const content = `
HEALTH RECORD DETAILS
=====================

Record Type: ${record.record_type}
Value: ${record.record_value}
Date: ${new Date(record.record_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
${record.notes ? `Notes: ${record.notes}` : ''}

---
Downloaded on: ${new Date().toLocaleString()}
      `.trim();

      // Create a blob and download
      const element = document.createElement('a');
      const file = new Blob([content], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `health-record-${record.record_type.replace(/\s+/g, '-')}-${new Date(record.record_date).toISOString().split('T')[0]}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      console.log("✅ [USER HEALTH RECORDS] Record downloaded successfully");
      setMessage("✓ Record downloaded!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("❌ [USER HEALTH RECORDS] Error downloading record:", error);
      setMessage("Error downloading record");
    }
  };

  if (loading) return <div className="min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center"><p className="text-gray-700 dark:text-gray-300">Loading health records...</p></div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-white dark:bg-gray-800 border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white dark:hover:bg-accent transition font-semibold text-sm"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-dark dark:text-white mb-2">📊 My Health Records</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">View your complete health history and medical records</p>

        {message && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
            {message}
          </div>
        )}

        {records.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow dark:shadow-gray-900/50 text-center">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">No health records yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your health records and test results will appear here</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {records.map((record) => (
              <div key={record.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900/50 border-l-4 border-accent hover:shadow-lg dark:hover:shadow-gray-900/70 transition">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-dark">{record.record_type || "Medical Record"}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      📅 {new Date(record.record_date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold">
                    ✓ Recorded
                  </span>
                </div>

                <div className="bg-background dark:bg-gray-700 p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Value</p>
                  <p className="text-2xl font-bold text-secondary">{record.record_value || "N/A"}</p>
                </div>

                {record.notes && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">📝 Notes</p>
                    <p className="text-gray-700 dark:text-gray-300">{record.notes}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleViewDetails(record)}
                    className="px-4 py-2 bg-accent dark:bg-purple-700 text-white rounded-lg hover:opacity-90 dark:hover:bg-purple-600 text-sm font-semibold transition"
                  >
                    👁️ View Details
                  </button>
                  <button 
                    onClick={() => handleDownload(record)}
                    className="px-4 py-2 bg-background dark:bg-gray-700 border-2 border-accent text-accent rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-sm font-semibold transition"
                  >
                    📥 Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Modal for viewing details */}
    {showModal && selectedRecord && (
      <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-gray-900/70 max-w-md w-full p-8">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-dark dark:text-white">📋 Record Details</h2>
            <button 
              onClick={() => setShowModal(false)}
              className="text-gray-500 dark:text-gray-400 hover:text-dark dark:hover:text-white text-2xl font-bold"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Record Type</label>
              <p className="text-lg font-bold text-dark dark:text-white">{selectedRecord.record_type}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Value</label>
              <p className="text-2xl font-bold text-secondary dark:text-purple-400">{selectedRecord.record_value}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Date</label>
              <p className="text-base text-dark dark:text-gray-300">{new Date(selectedRecord.record_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            {selectedRecord.notes && (
              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Notes</label>
                <p className="text-base text-dark dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded">{selectedRecord.notes}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Record ID</label>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{selectedRecord.id}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button 
              onClick={() => {
                handleDownload(selectedRecord);
                setShowModal(false);
              }}
              className="flex-1 py-2 bg-accent dark:bg-purple-700 text-white rounded-lg hover:opacity-90 dark:hover:bg-purple-600 font-semibold transition"
            >
              📥 Download
            </button>
            <button 
              onClick={() => setShowModal(false)}
              className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 text-dark dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}
    <Footer />
    </>
  );
}
