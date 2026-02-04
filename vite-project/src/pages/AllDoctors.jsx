import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doctorAPI } from "../api/api";
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
      setDoctors(response.data.doctors || response.data || []);
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
                    <div className="text-sm">
                      <span className={`inline-block px-3 py-1 rounded-full font-semibold ${isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'}`}>
                        ✓ Available Today
                      </span>
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
