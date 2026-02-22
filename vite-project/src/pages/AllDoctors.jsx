import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doctorAPI, timeSlotAPI } from "../api/api";
import { formatTime12Hour } from "../utils/timeFormat";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AllDoctors() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [selectedRating, setSelectedRating] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [doctors, setDoctors] = useState([]);
  const [doctorSlots, setDoctorSlots] = useState({});
  const [scheduleModal, setScheduleModal] = useState({ open: false, doctor: null });
  const [modalDate, setModalDate] = useState('');
  const [modalSlots, setModalSlots] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const specialties = [
    "All",
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "Gastroenterology",
    "General Practice",
    "Hematology",
    "Infectious Disease",
    "Internal Medicine",
    "Nephrology",
    "Neurology",
    "Obstetrics & Gynecology",
    "Oncology",
    "Ophthalmology",
    "Orthopedics",
    "Otolaryngology (ENT)",
    "Pediatrics",
    "Psychiatry",
    "Pulmonology",
    "Radiology",
    "Rheumatology",
    "Surgery",
    "Urology"
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      console.log("📤 [ALL DOCTORS PAGE] Fetching all doctors from API...");
      const response = await doctorAPI.getAllDoctors();
      console.log("✅ [ALL DOCTORS PAGE] Doctors data received from backend:", response.data);
      const docs = response.data.doctors || response.data || [];
      setDoctors(docs);

      // Prefetch next-day slots for each doctor (first 3 shown on card)
      try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const iso = tomorrow.toISOString().split('T')[0];
        const slotPromises = docs.map(d =>
          timeSlotAPI.getTimeSlots({ doctor_id: d.id, date: iso }).then(r => ({ id: d.id, slots: r.data.slots || [] })).catch(() => ({ id: d.id, slots: [] }))
        );
        const results = await Promise.all(slotPromises);
        const map = {};
        results.forEach(r => { map[r.id] = r.slots; });
        setDoctorSlots(map);
      } catch (err) {
        console.warn('Could not prefetch doctor slots', err);
      }
    } catch (error) {
      console.error("❌ [ALL DOCTORS PAGE] Error loading doctors:", error);
      setMessage("Error loading doctors: " + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors
    .filter(doc => {
      const matchesSpecialty = selectedSpecialty === "All" || doc.specialization === selectedSpecialty;
      const matchesSearch = (doc.name || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRating = selectedRating === "all" || (doc.rating && doc.rating >= parseInt(selectedRating));
      return matchesSpecialty && matchesSearch && matchesRating;
    })
    .sort((a, b) => {
      if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "experience") return (b.experience_years || 0) - (a.experience_years || 0);
      if (sortBy === "fee") return (a.consultation_fee || 0) - (b.consultation_fee || 0);
      return 0;
    });

  if (loading) return (
    <>
      <Navbar />
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-background'}`}>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading doctors...</p>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      
      <div className={`min-h-screen px-4 py-12 ${isDark ? 'bg-gray-900' : 'bg-background'}`}>
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-dark'}`}>
            Find Our <span className="text-accent">Expert Doctors</span>
          </h1>
          <p className={`text-lg max-w-2xl mx-auto mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Browse through our network of verified healthcare professionals and book your consultation today
          </p>
        </div>

        {message && (
          <div className="max-w-7xl mx-auto mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {message}
          </div>
        )}

        {/* Filters Section */}
        <div className="max-w-7xl mx-auto mb-8 space-y-6">
          {/* Search Bar */}
          <div>
            <input
              type="text"
              placeholder="🔍 Search doctors by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-6 py-4 border-2 border-accent rounded-lg focus:outline-none text-lg ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
            />
          </div>

          {/* Filter Controls */}
          <div className="grid md:grid-cols-4 gap-4">
            {/* Specialty Filter */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-dark'}`}>Specialty</label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className={`w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-accent ${isDark ? 'bg-gray-800 text-white border-gray-600' : ''}`}
              >
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-dark'}`}>Minimum Rating</label>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className={`w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-accent ${isDark ? 'bg-gray-800 text-white border-gray-600' : ''}`}
              >
                <option value="all">All Ratings</option>
                <option value="3">3+ ⭐</option>
                <option value="4">4+ ⭐</option>
                <option value="5">5 ⭐</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-dark'}`}>Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-accent ${isDark ? 'bg-gray-800 text-white border-gray-600' : ''}`}
              >
                <option value="name">Name (A-Z)</option>
                <option value="rating">Rating (High to Low)</option>
                <option value="experience">Experience (High to Low)</option>
                <option value="fee">Fee (Low to High)</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSpecialty("All");
                  setSelectedRating("all");
                  setSortBy("name");
                }}
                className="w-full px-4 py-2 bg-secondary text-white rounded-lg hover:opacity-90 transition font-semibold"
              >
                🔄 Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="max-w-7xl mx-auto mb-6">
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing <span className="font-bold">{filteredDoctors.length}</span> of <span className="font-bold">{doctors.length}</span> doctors
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="max-w-7xl mx-auto">
          {filteredDoctors.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className={`rounded-xl shadow hover:shadow-2xl transition overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                >
                  {/* Doctor Header */}
                  <div className="bg-secondary p-6 text-white text-center">
                    <div className="text-6xl mb-3">👨‍⚕️</div>
                    <h2 className="text-xl font-bold">{doctor.name || "N/A"}</h2>
                    <p className="text-sm opacity-90">{doctor.specialization || "N/A"}</p>
                  </div>

                  {/* Doctor Details */}
                  <div className="p-6 space-y-4">
                    {/* Rating */}
                    <div className={`flex items-center justify-between pb-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Rating</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xl font-bold text-accent">{doctor.rating || 0}</span>
                        <span className="text-yellow-400">★</span>
                        <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>({doctor.total_reviews || 0})</span>
                      </div>
                    </div>

                    {/* Experience */}
                    <div className={`flex items-center justify-between pb-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Experience</span>
                      <span className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-dark'}`}>{doctor.experience_years || 0} years</span>
                    </div>

                    {/* Fee */}
                    <div className={`flex items-center justify-between pb-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Consultation Fee</span>
                      <span className="text-lg font-bold text-primary">${doctor.consultation_fee || 0}</span>
                    </div>

                    {/* Bio */}
                    {doctor.bio && (
                      <div className={`py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                        <p className={`text-sm line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{doctor.bio}</p>
                      </div>
                    )}

                    {/* Availability */}
                      <div className="text-sm space-y-2">
                      <div>
                        <span className={`inline-block px-3 py-1 rounded-full font-semibold ${isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'}`}>
                          ✓ Available Tomorrow
                        </span>
                      </div>
                      <div className="mt-2">
                        {(doctorSlots[doctor.id] || []).slice(0,3).length > 0 ? (
                          <div className="flex gap-2">
                            {(doctorSlots[doctor.id] || []).slice(0,3).map((t,i) => (
                              <div key={i} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-200">{formatTime12Hour(t)} • 30m</div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500">No slots tomorrow</div>
                        )}
                      </div>
                    </div>
                    {/* Quick View Schedule */}
                    <div className="p-4 border-t">
                      <button
                        onClick={async () => {
                          setScheduleModal({ open: true, doctor });
                          // default date = tomorrow
                          const tomorrow = new Date();
                          tomorrow.setDate(tomorrow.getDate() + 1);
                          const iso = tomorrow.toISOString().split('T')[0];
                          setModalDate(iso);
                          setModalLoading(true);
                          try {
                            const res = await timeSlotAPI.getTimeSlots({ doctor_id: doctor.id, date: iso });
                            setModalSlots(res.data.slots || []);
                          } catch (err) {
                            setModalSlots([]);
                          } finally {
                            setModalLoading(false);
                          }
                        }}
                        className="mt-3 w-full py-2 text-sm rounded-lg border-2 border-accent bg-background text-accent hover:bg-accent hover:text-white transition"
                      >
                        📆 View Full Schedule
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3 pt-4">
                      <button 
                        onClick={() => navigate(`/patient/book/${doctor.id}`)}
                        className="py-2 bg-accent text-white rounded-lg hover:opacity-90 transition font-semibold text-sm"
                      >
                        📅 Book
                      </button>
                      <button className={`py-2 rounded-lg transition font-semibold text-sm border-2 border-accent ${isDark ? 'bg-gray-700 text-accent hover:bg-gray-600' : 'bg-background text-accent hover:bg-gray-100'}`}>
                        👁️ Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-16 rounded-xl shadow ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="text-6xl mb-4">🔍</div>
              <p className={`text-lg mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>No doctors found matching your criteria</p>
              <p className={`text-sm mb-6 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Try adjusting your search filters</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSpecialty("All");
                  setSelectedRating("all");
                  setSortBy("name");
                }}
                className="px-6 py-2 bg-accent text-white rounded-lg hover:opacity-90 font-semibold"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Schedule Modal */}
        {scheduleModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-40" onClick={() => setScheduleModal({ open: false, doctor: null })}></div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full mx-4 z-50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Schedule for Dr. {scheduleModal.doctor?.name}</h3>
                <button onClick={() => setScheduleModal({ open: false, doctor: null })} className="text-sm px-3 py-1">✕</button>
              </div>
              <div className="mb-4">
                <label className="text-sm block mb-1">Select Date</label>
                <input type="date" value={modalDate} onChange={async (e) => {
                  const val = e.target.value; setModalDate(val); setModalLoading(true);
                  try { const res = await timeSlotAPI.getTimeSlots({ doctor_id: scheduleModal.doctor.id, date: val }); setModalSlots(res.data.slots || []); } catch (err) { setModalSlots([]); }
                  setModalLoading(false);
                }} className="p-2 border rounded" />
              </div>
              <div>
                {modalLoading ? (
                  <div>Loading slots...</div>
                ) : modalSlots.length === 0 ? (
                  <div className="text-sm text-gray-500">No available slots for this date.</div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {modalSlots.map((t, i) => (
                      <button key={i} onClick={() => {
                        // Navigate to book page with prefilled date/time
                        navigate(`/patient/book/${scheduleModal.doctor.id}`, { state: { selectedDate: modalDate, selectedTime: t } });
                        setScheduleModal({ open: false, doctor: null });
                      }} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm hover:bg-accent hover:text-white transition">
                        {formatTime12Hour(t)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats Section */}
        {filteredDoctors.length > 0 && (
          <div className="max-w-7xl mx-auto mt-16">
            <div className="grid md:grid-cols-4 gap-6">
              <div className={`p-6 rounded-xl shadow text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <p className="text-3xl font-bold text-accent mb-2">{filteredDoctors.length}</p>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Doctors Found</p>
              </div>
              <div className={`p-6 rounded-xl shadow text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <p className="text-3xl font-bold text-accent mb-2">
                  {(filteredDoctors.reduce((sum, d) => sum + (d.rating || 0), 0) / filteredDoctors.length).toFixed(1)}
                </p>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Average Rating</p>
              </div>
              <div className={`p-6 rounded-xl shadow text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <p className="text-3xl font-bold text-accent mb-2">
                  {Math.max(...filteredDoctors.map(d => d.experience_years || 0))}+
                </p>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Max Experience</p>
              </div>
              <div className={`p-6 rounded-xl shadow text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <p className="text-3xl font-bold text-accent mb-2">
                  ${Math.min(...filteredDoctors.map(d => d.consultation_fee || 0))} - ${Math.max(...filteredDoctors.map(d => d.consultation_fee || 0))}
                </p>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Fee Range</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
