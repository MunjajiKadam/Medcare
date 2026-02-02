import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doctorAPI } from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AllDoctors() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [selectedRating, setSelectedRating] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const specialties = ["All", ...Array.from(new Set(doctors.map(d => d.specialization).filter(Boolean)))];

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-gray-600">Loading doctors...</p>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-background px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">
            Find Our <span className="text-accent">Expert Doctors</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
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
              className="w-full px-6 py-4 border-2 border-accent rounded-lg focus:outline-none bg-white text-lg"
            />
          </div>

          {/* Filter Controls */}
          <div className="grid md:grid-cols-4 gap-4">
            {/* Specialty Filter */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Specialty</label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-accent"
              >
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Minimum Rating</label>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-accent"
              >
                <option value="all">All Ratings</option>
                <option value="3">3+ ⭐</option>
                <option value="4">4+ ⭐</option>
                <option value="5">5 ⭐</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-accent"
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
          <p className="text-gray-600 text-sm">
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
                  className="bg-white rounded-xl shadow hover:shadow-2xl transition overflow-hidden"
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
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Rating</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xl font-bold text-accent">{doctor.rating || 0}</span>
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-500">({doctor.total_reviews || 0})</span>
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Experience</span>
                      <span className="text-sm font-semibold text-dark">{doctor.experience_years || 0} years</span>
                    </div>

                    {/* Fee */}
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Consultation Fee</span>
                      <span className="text-lg font-bold text-primary">${doctor.consultation_fee || 0}</span>
                    </div>

                    {/* Bio */}
                    {doctor.bio && (
                      <div className="py-4 border-b border-gray-200">
                        <p className="text-sm text-gray-600 line-clamp-2">{doctor.bio}</p>
                      </div>
                    )}

                    {/* Availability */}
                    <div className="text-sm text-gray-600">
                      <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                        ✓ Available Today
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3 pt-4">
                      <button 
                        onClick={() => navigate(`/user/book/${doctor.id}`)}
                        className="py-2 bg-accent text-white rounded-lg hover:opacity-90 transition font-semibold text-sm"
                      >
                        📅 Book
                      </button>
                      <button className="py-2 bg-background text-accent border-2 border-accent rounded-lg hover:bg-gray-100 transition font-semibold text-sm">
                        👁️ Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-600 text-lg mb-2">No doctors found matching your criteria</p>
              <p className="text-sm text-gray-500 mb-6">Try adjusting your search filters</p>
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
              <div className="bg-white p-6 rounded-xl shadow text-center">
                <p className="text-3xl font-bold text-accent mb-2">{filteredDoctors.length}</p>
                <p className="text-gray-600">Doctors Found</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow text-center">
                <p className="text-3xl font-bold text-accent mb-2">
                  {(filteredDoctors.reduce((sum, d) => sum + (d.rating || 0), 0) / filteredDoctors.length).toFixed(1)}
                </p>
                <p className="text-gray-600">Average Rating</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow text-center">
                <p className="text-3xl font-bold text-accent mb-2">
                  {Math.max(...filteredDoctors.map(d => d.experience_years || 0))}+
                </p>
                <p className="text-gray-600">Max Experience</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow text-center">
                <p className="text-3xl font-bold text-accent mb-2">
                  ${Math.min(...filteredDoctors.map(d => d.consultation_fee || 0))} - ${Math.max(...filteredDoctors.map(d => d.consultation_fee || 0))}
                </p>
                <p className="text-gray-600">Fee Range</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
