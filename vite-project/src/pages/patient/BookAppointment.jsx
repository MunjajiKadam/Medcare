import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { appointmentAPI, doctorAPI, timeSlotAPI } from "../../api/api";
import { useTheme } from "../../context/ThemeContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { formatTime12Hour } from "../../utils/timeFormat";

export default function BookAppointment() {
  const navigate = useNavigate();
  const { doctorId } = useParams();
  const { theme } = useTheme();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  console.log("📋 [BOOK APPOINTMENT] Component loaded - Doctor ID:", doctorId);

  const reasons = ["General Checkup", "Follow-up", "Consultation", "Emergency", "Check-up"];
  
  // Get next 7 days
  const getNextDates = () => {
    const dates = [];
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        value: date.toISOString().split('T')[0],
        raw: date
      });
    }
    return dates;
  };

  const nextDates = getNextDates();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        console.log("🔄 [BOOK APPOINTMENT] Fetching doctor with ID:", doctorId);
        const res = await doctorAPI.getDoctorById(doctorId);
        console.log("✅ [BOOK APPOINTMENT] Doctor data received:", res.data);
        const doctorData = res.data.doctor || res.data;
        if (!doctorData) {
          throw new Error("No doctor data received from API");
        }
        setDoctor(doctorData);
        setLoading(false);
      } catch (err) {
        console.error("❌ [BOOK APPOINTMENT] Error fetching doctor:", err);
        const errorMsg = err.response?.data?.message || err.message || "Failed to load doctor details";
        setError(errorMsg);
        setLoading(false);
      }
    };
    if (doctorId) {
      fetchDoctor();
    } else {
      setError("No doctor ID provided");
      setLoading(false);
    }
  }, [doctorId]);

  // Fetch time slots when date is selected
  useEffect(() => {
    if (selectedDate && doctorId) {
      console.log("📅 [BOOK APPOINTMENT] Date selected:", selectedDate);
      const fetchTimeSlots = async () => {
        try {
          console.log("🔄 [BOOK APPOINTMENT] Fetching time slots for doctor:", doctorId, "date:", selectedDate);
          const res = await timeSlotAPI.getTimeSlots({ doctor_id: doctorId, date: selectedDate });
          console.log("✅ [BOOK APPOINTMENT] Time slots API response:", res.data);
          const slots = res.data.slots || res.data || [];
          console.log("📍 [BOOK APPOINTMENT] Slots array:", slots);
          
          if (slots.length > 0) {
            // Extract time strings from slot objects (only doctor's actual time slots)
            const times = slots
              .map(s => {
                if (typeof s === 'string') return s;
                if (s.start_time) return s.start_time;
                if (s.time) return s.time;
                return null;
              })
              .filter(t => t !== null);
            console.log("⏰ [BOOK APPOINTMENT] Doctor's available time slots:", times);
            setTimeSlots(times);
          } else {
            console.log("⚠️ [BOOK APPOINTMENT] No time slots available for this day");
            setTimeSlots([]);
          }
        } catch (err) {
          console.error("❌ [BOOK APPOINTMENT] Error fetching time slots:", err);
          console.log("📌 [BOOK APPOINTMENT] No slots available");
          setTimeSlots([]);
        }
      };
      fetchTimeSlots();
    }
  }, [selectedDate, doctorId]);

  const handleBookAppointment = async () => {
    if (submitting) {
      console.warn("⏳ [BOOK APPOINTMENT] Button already processing, please wait...");
      return;
    }
    
    try {
      setSubmitting(true);
      const appointmentData = {
        doctorId: parseInt(doctorId),
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        reasonForVisit: reason,
        symptoms: symptoms || ""
      };
      
      console.log("📤 [BOOK APPOINTMENT] Submitting appointment with data:", appointmentData);
      console.log("🔗 [BOOK APPOINTMENT] API endpoint: /api/appointments");
      console.log("📋 [BOOK APPOINTMENT] Doctor ID:", appointmentData.doctorId);
      console.log("📅 [BOOK APPOINTMENT] Date:", appointmentData.appointmentDate);
      console.log("🕐 [BOOK APPOINTMENT] Time:", appointmentData.appointmentTime);
      console.log("💬 [BOOK APPOINTMENT] Reason:", appointmentData.reasonForVisit);
      console.log("🏥 [BOOK APPOINTMENT] Symptoms:", appointmentData.symptoms);
      
      const response = await appointmentAPI.createAppointment(appointmentData);

      console.log("✅ [BOOK APPOINTMENT] Appointment created successfully!");
      console.log("📦 [BOOK APPOINTMENT] Response data:", response.data);
      console.log("🎉 [BOOK APPOINTMENT] Appointment ID:", response.data?.appointment?.id);
      setConfirmed(true);
      
      // Delay before allowing next action (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to book appointment";
      console.error("❌ [BOOK APPOINTMENT] Error occurred:", errorMsg);
      console.error("📊 [BOOK APPOINTMENT] Full error object:", err);
      if (err.response) {
        console.error("🔴 [BOOK APPOINTMENT] Response status:", err.response.status);
        console.error("📝 [BOOK APPOINTMENT] Response data:", err.response.data);
      }
      setError(errorMsg);
      
      // Delay before allowing retry (1.5 seconds)
      await new Promise(resolve => setTimeout(resolve, 1500));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 dark:border-purple-400"></div>
            <p className="text-gray-700 dark:text-gray-300 mt-4 text-lg font-medium">Loading doctor details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error && !doctor) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-12">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl dark:shadow-gray-900/70 w-full max-w-md text-center border border-gray-200 dark:border-gray-700">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Error Loading Doctor</h2>
            <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
            <button 
              onClick={() => navigate(-1)}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white rounded-lg font-bold hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              ← Go Back
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!doctor) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-12">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl dark:shadow-gray-900/70 w-full max-w-md text-center border border-gray-200 dark:border-gray-700">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Doctor Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">We couldn't find the doctor you're looking for.</p>
            <button 
              onClick={() => navigate(-1)}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white rounded-lg font-bold hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              ← Go Back
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (confirmed) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-12">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl dark:shadow-gray-900/70 w-full max-w-md text-center border border-gray-200 dark:border-gray-700">
            <div className="text-6xl mb-4 animate-bounce">✅</div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">Appointment Booked!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Your appointment has been confirmed successfully</p>
            
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-700 p-6 rounded-xl mb-6 text-left space-y-3 border border-purple-200 dark:border-gray-600">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">👨‍⚕️ Doctor</p>
                <p className="font-bold text-gray-800 dark:text-white">Dr. {doctor?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">🎯 Specialization</p>
                <p className="font-bold text-gray-800 dark:text-white">{doctor?.specialization}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">📅 Date & Time</p>
                <p className="font-bold text-gray-800 dark:text-white">
                  {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {formatTime12Hour(selectedTime)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">📝 Reason</p>
                <p className="font-bold text-gray-800 dark:text-white">{reason}</p>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => navigate(`/patient/doctor/${doctorId}`)}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 text-white rounded-lg font-bold hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                👨‍⚕️ View Doctor Profile
              </button>
              <button 
                onClick={() => navigate("/patient/appointments")}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white rounded-lg font-bold hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                📅 View My Appointments
              </button>
              <button 
                onClick={() => navigate("/patient/dashboard")}
                className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
              >
                🏠 Back to Dashboard
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl dark:shadow-gray-900/70 border border-gray-200 dark:border-gray-700">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="mb-6 px-4 py-2 text-sm bg-white dark:bg-gray-700 border-2 border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white transition font-semibold shadow-md dark:shadow-gray-900/50"
            >
              ← Back
            </button>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-3">📅 Book an Appointment</h1>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                Dr. {doctor?.name} - {doctor?.specialization}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                💰 Consultation Fee: ${doctor?.consultation_fee}
              </p>
              
              {/* Progress */}
              <div className="flex gap-2 mt-6">
                {[1, 2, 3].map(s => (
                  <div
                    key={s}
                    className={`flex-1 h-3 rounded-full transition-all duration-300 ${
                      s <= step ? "bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 shadow-md" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-100 dark:bg-red-900/30 border-2 border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Step 1: Select Date */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">📅 Select Date</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {nextDates.map(date => (
                    <button
                      key={date.value}
                      onClick={() => {
                        console.log("📅 [STEP 1] Date clicked:", date.value, date.label);
                        setSelectedDate(date.value);
                        setSelectedTime("");
                      }}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 font-semibold ${
                        selectedDate === date.value
                          ? "border-purple-600 dark:border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-600 dark:text-purple-400 shadow-lg scale-105"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md"
                      }`}
                    >
                      <div className="text-base">{date.label}</div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      console.log("➡️ [STEP 1→2] Moving to time selection - Selected Date:", selectedDate);
                      setStep(2);
                    }}
                    disabled={!selectedDate}
                    className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white rounded-lg font-bold hover:shadow-xl hover:scale-105 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Next: Select Time →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Select Time */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">⏰ Select Time</h2>
                
                {timeSlots.length === 0 ? (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-600 rounded-xl p-6 mb-6 text-center">
                    <p className="text-yellow-800 dark:text-yellow-400 font-semibold mb-2 text-lg">⚠️ No Available Time Slots</p>
                    <p className="text-yellow-700 dark:text-yellow-500 text-sm">
                      The doctor has not set any available time slots for this day. 
                      Please select a different date or contact the doctor directly.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    {timeSlots.map((time, idx) => (
                      <button
                        key={`${time}-${idx}`}
                        onClick={() => {
                          console.log("🕐 [STEP 2] Time selected:", time);
                          setSelectedTime(time);
                        }}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 font-semibold text-center ${
                          selectedTime === time
                            ? "border-purple-600 dark:border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-600 dark:text-purple-400 shadow-lg scale-105"
                            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md"
                        }`}
                      >
                        {formatTime12Hour(time)}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      console.log("⬅️ [STEP 2→1] Going back to date selection");
                      setStep(1);
                      setSelectedTime("");
                    }}
                    className="flex-1 py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => {
                      console.log("➡️ [STEP 2→3] Moving to details - Selected Time:", selectedTime, "Date:", selectedDate);
                      setStep(3);
                    }}
                    disabled={!selectedTime}
                    className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white rounded-lg font-bold hover:shadow-xl hover:scale-105 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Next: Details →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Enter Details */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">📋 Appointment Details</h2>
                
                <div className="space-y-5 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      🎯 Reason for Visit *
                    </label>
                    <select
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition"
                    >
                      <option value="">Select reason</option>
                      {reasons.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      💬 Symptoms/Description
                    </label>
                    <textarea
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="Describe your symptoms or reason for visit (optional)"
                      rows="4"
                      className="w-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-700 p-6 rounded-xl border-2 border-purple-200 dark:border-gray-600">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-4 text-lg">📝 Appointment Summary</h3>
                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                      <p><strong className="text-gray-800 dark:text-white">👨‍⚕️ Doctor:</strong> Dr. {doctor?.name}</p>
                      <p><strong className="text-gray-800 dark:text-white">📅 Date:</strong> {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <p><strong className="text-gray-800 dark:text-white">⏰ Time:</strong> {formatTime12Hour(selectedTime)}</p>
                      <p><strong className="text-gray-800 dark:text-white">🎯 Reason:</strong> {reason || "Not selected"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleBookAppointment}
                    disabled={!reason || submitting}
                    className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 text-white rounded-lg font-bold hover:shadow-xl hover:scale-105 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-200"
                  >
                    {submitting ? "⏳ Booking..." : "✓ Confirm & Book"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
