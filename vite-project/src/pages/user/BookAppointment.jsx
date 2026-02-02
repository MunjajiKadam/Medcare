import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function BookAppointment() {
  const navigate = useNavigate();
  const { doctorId } = useParams();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];
  const reasons = ["General Checkup", "Follow-up", "Consultation", "Emergency"];

  const handleConfirm = () => {
    if (selectedDate && selectedTime && reason) {
      console.log("📤 [BOOK APPOINTMENT] Booking appointment with data:", {
        date: selectedDate,
        time: selectedTime,
        reason: reason,
        symptoms: symptoms,
        doctorId: doctorId
      });
      setConfirmed(true);
      console.log("✅ [BOOK APPOINTMENT] Appointment confirmed successfully");
    }
  };

  if (confirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-3xl font-bold text-dark mb-2">Appointment Booked!</h2>
          <p className="text-gray-600 mb-6">Your appointment has been confirmed</p>
          
          <div className="bg-background p-6 rounded-lg mb-6 text-left space-y-3">
            <div>
              <p className="text-sm text-gray-600">Doctor</p>
              <p className="font-bold text-dark">Dr. Sarah Johnson - Cardiologist</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date & Time</p>
              <p className="font-bold text-dark">{selectedDate} at {selectedTime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="font-bold text-dark">{reason}</p>
            </div>
          </div>

          <button className="w-full py-3 bg-accent text-white rounded-lg font-bold hover:opacity-90 transition">
            View in Calendar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-3 py-1 text-sm bg-background border border-accent text-accent rounded hover:bg-accent hover:text-white transition"
        >
          ← Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark mb-2">Book an Appointment</h1>
          <p className="text-gray-600">Dr. Sarah Johnson - Cardiologist</p>
          
          {/* Progress */}
          <div className="flex gap-2 mt-6">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full ${
                  s <= step ? "bg-accent" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Step 1: Select Date */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-dark mb-4">📅 Select Date</h2>
            <div className="space-y-3 mb-6">
              {["Today", "Tomorrow", "Day After Tomorrow"].map((dateLabel, idx) => (
                <button
                  key={dateLabel}
                  onClick={() => {
                    setSelectedDate(dateLabel);
                    setStep(2);
                  }}
                  className={`w-full p-4 rounded-lg border-2 transition text-left ${
                    selectedDate === dateLabel
                      ? "border-accent bg-background"
                      : "border-gray-300 hover:border-accent"
                  }`}
                >
                  <p className="font-semibold text-dark">{dateLabel}</p>
                  <p className="text-sm text-gray-600">Jan {31 + idx}, 2026</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Time */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-dark mb-4">⏰ Select Time</h2>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {timeSlots.map(time => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 rounded-lg border-2 transition font-semibold ${
                    selectedTime === time
                      ? "border-accent bg-accent text-white"
                      : "border-gray-300 hover:border-accent text-dark"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-2 border-2 border-accent text-accent rounded-lg hover:bg-background transition font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!selectedTime}
                className="flex-1 py-2 bg-accent text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition font-semibold"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Reason & Symptoms */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-dark mb-4">📝 Reason for Visit</h2>
            
            {/* Reason */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-dark mb-2">Type of Visit</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-accent"
              >
                <option value="">Select a reason</option>
                {reasons.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Symptoms */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-dark mb-2">Describe your symptoms (optional)</label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Share any symptoms or concerns..."
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                rows="3"
              ></textarea>
            </div>

            {/* Summary */}
            <div className="bg-background p-4 rounded-lg mb-6">
              <h3 className="font-bold text-dark mb-2">Appointment Summary</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>📅 <strong>{selectedDate}</strong></p>
                <p>⏰ <strong>{selectedTime}</strong></p>
                <p>👨‍⚕️ <strong>Dr. Sarah Johnson</strong></p>
                <p>📋 <strong>{reason}</strong></p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 border-2 border-accent text-accent rounded-lg hover:bg-background transition font-semibold"
              >
                Back
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 bg-accent text-white rounded-lg hover:opacity-90 transition font-semibold"
              >
                Confirm Appointment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
