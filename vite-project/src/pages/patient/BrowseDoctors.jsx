import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doctorAPI } from "../../api/api";
import SkeletonCard from "../../components/SkeletonCard";
import EmptyState from "../../components/EmptyState";

export default function BrowseDoctors() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
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
      console.log("📤 [USER BROWSE DOCTORS] Fetching doctors from API...");
      const response = await doctorAPI.getAllDoctors();
      console.log("✅ [USER BROWSE DOCTORS] Doctors data received from backend:", response.data);
      setDoctors(response.data.doctors || response.data || []);
    } catch (error) {
      console.error("❌ [USER BROWSE DOCTORS] Error loading doctors:", error);
      setMessage("Error loading doctors: " + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doc => {
    const matchesSpecialty = selectedSpecialty === "All" || doc.specialization === selectedSpecialty;
    const matchesSearch = (doc.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  if (loading) return (
    <div className="min-h-screen bg-background dark:bg-gray-900 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="h-10 bg-gray-200 rounded w-24 mb-8 animate-pulse"></div>
        <div className="text-center mb-12">
          <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-64 mx-auto animate-pulse"></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard type="doctor" />
          <SkeletonCard type="doctor" />
          <SkeletonCard type="doctor" />
          <SkeletonCard type="doctor" />
          <SkeletonCard type="doctor" />
          <SkeletonCard type="doctor" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto mb-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-white dark:bg-gray-800 border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white dark:hover:bg-accent transition font-semibold text-sm"
        >
          ← Back
        </button>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-dark mb-4">
          Find <span className="text-accent">Expert Doctors</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Browse our network of verified healthcare professionals
        </p>
      </div>

      {message && (
        <div className="max-w-6xl mx-auto mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {message}
        </div>
      )}

      <div className="max-w-6xl mx-auto mb-8">
        <label htmlFor="doctor-search" className="sr-only">Search doctors by name</label>
        <input
          id="doctor-search"
          type="text"
          placeholder="🔍 Search doctors by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-6 py-3 border-2 border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 bg-white dark:bg-gray-800 dark:border-gray-600"
          aria-label="Search doctors by name"
        />
      </div>

      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Filter by specialty">
          {specialties.map(specialty => (
            <button
              key={specialty}
              onClick={() => setSelectedSpecialty(specialty)}
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 active:scale-95 ${
                selectedSpecialty === specialty
                  ? "bg-accent text-white"
                  : "bg-white text-accent border-2 border-accent hover:bg-background"
              }`}
              aria-pressed={selectedSpecialty === specialty}
              aria-label={`Filter by ${specialty}`}
            >
              {specialty}
            </button>
          ))}
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="max-w-6xl mx-auto">
        {filteredDoctors.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <article
                key={doctor.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow dark:shadow-gray-900/50 hover:shadow-xl dark:hover:shadow-gray-900/70 transition overflow-hidden cursor-pointer group focus-within:ring-2 focus-within:ring-accent"
                onClick={() => navigate(`/patient/doctor/${doctor.id}`)}
                role="button"
                tabIndex="0"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/patient/doctor/${doctor.id}`);
                  }
                }}
                aria-label={`View Dr. ${doctor.name || "N/A"} profile`}
              >
                {/* Doctor Header */}
                <div className="bg-gradient-to-r from-secondary to-blue-600 p-6 text-white text-center group-hover:from-blue-700 group-hover:to-blue-700 transition">
                  <div className="text-5xl mb-3" role="img" aria-label="Doctor">👨‍⚕️</div>
                  <h2 className="text-lg font-bold">Dr. {doctor.name || "N/A"}</h2>
                  <p className="text-sm opacity-90">{doctor.specialization || "N/A"}</p>
                </div>

                {/* Doctor Details */}
                <div className="p-6 space-y-4">
                  {/* Rating */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rating</span>
                    <div className="flex items-center gap-1" aria-label={`Rated ${doctor.rating || 0} out of 5 stars based on ${doctor.total_reviews || 0} reviews`}>
                      <span className="text-lg font-bold text-accent">{doctor.rating || 0}</span>
                      <span className="text-yellow-400" aria-hidden="true">★</span>
                      <span className="text-sm text-gray-500">({doctor.total_reviews || 0})</span>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Experience</span>
                    <span className="text-sm font-semibold text-dark">{doctor.experience_years || 0} years</span>
                  </div>

                  {/* Fee */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Consultation Fee</span>
                    <span className="text-lg font-bold text-primary">${doctor.consultation_fee || 0}</span>
                  </div>

                  {/* License */}
                  {doctor.license_number && (
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>License:</span>
                      <span className="font-mono">{doctor.license_number}</span>
                    </div>
                  )}

                  {/* Availability */}
                  <div className="text-sm text-gray-600">
                    <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-semibold">
                      ✓ Available
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/patient/book/${doctor.id}`);
                      }}
                      className="py-2 bg-accent text-white rounded-lg hover:opacity-90 transition font-semibold text-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                      aria-label={`Book appointment with Dr. ${doctor.name}`}
                    >
                      📅 Book Now
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/patient/doctor/${doctor.id}`);
                      }}
                      className="py-2 bg-background dark:bg-gray-700 text-accent rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition font-semibold text-sm border-2 border-accent active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                      aria-label={`View Dr. ${doctor.name} full profile`}
                    >
                      👁️ View
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="🔍"
            title="No Doctors Found"
            description={searchTerm || selectedSpecialty !== "All" 
              ? "No doctors match your search criteria. Try adjusting your filters."
              : "No doctors available at the moment."}
            actionLabel={searchTerm || selectedSpecialty !== "All" ? "Clear Filters" : ""}
            onAction={searchTerm || selectedSpecialty !== "All" ? () => {
              setSearchTerm("");
              setSelectedSpecialty("All");
            } : null}
          />
        )}
      </div>
    </div>
  );
}
