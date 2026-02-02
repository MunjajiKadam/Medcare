import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doctorAPI } from "../../api/api";

export default function Doctors() {
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
      console.log("📤 [DOCTOR PAGE - DOCTORS LIST] Fetching doctors list from API...");
      const response = await doctorAPI.getAllDoctors();
      console.log("✅ [DOCTOR PAGE - DOCTORS LIST] Doctors data received from backend:", response.data);
      setDoctors(response.data.doctors);
    } catch (error) {
      console.error("❌ [DOCTOR PAGE - DOCTORS LIST] Error loading doctors:", error);
      setMessage("Error loading doctors: " + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doc => {
    const matchesSpecialty = selectedSpecialty === "All" || doc.specialization === selectedSpecialty;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p>Loading doctors...</p></div>;

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto mb-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-white border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition font-semibold text-sm"
        >
          ← Back
        </button>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-dark mb-4">
          Find Our <span className="text-accent">Expert Doctors</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Browse through our network of verified healthcare professionals
        </p>
      </div>

      <div className="max-w-6xl mx-auto mb-8">
        <input
          type="text"
          placeholder="🔍 Search doctors by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-6 py-3 border-2 border-accent rounded-lg focus:outline-none bg-white"
        />
      </div>

      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {specialties.map(specialty => (
            <button
              key={specialty}
              onClick={() => setSelectedSpecialty(specialty)}
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition ${
                selectedSpecialty === specialty
                  ? "bg-accent text-white"
                  : "bg-white text-accent border-2 border-accent hover:bg-background"
              }`}
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
              <div
                key={doctor.id}
                className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden"
              >
                {/* Doctor Header */}
                <div className="bg-secondary p-6 text-white text-center">
                  <div className="text-5xl mb-3">👨‍⚕️</div>
                  <h2 className="text-lg font-bold">{doctor.name}</h2>
                  <p className="text-sm opacity-90">{doctor.specialization}</p>
                </div>

                {/* Doctor Details */}
                <div className="p-6 space-y-4">
                  {/* Rating */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rating</span>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold text-accent">{doctor.rating}</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-500">({doctor.total_reviews})</span>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Experience</span>
                    <span className="text-sm font-semibold text-dark">{doctor.experience_years}</span>
                  </div>

                  {/* Fee */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Consultation Fee</span>
                    <span className="text-lg font-bold text-primary">{doctor.consultation_fee}</span>
                  </div>

                  {/* Availability */}
                  <div className="text-sm text-gray-600">
                    <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded">
                      ✓ Available Today
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <button className="py-2 bg-background text-accent rounded-lg hover:bg-gray-100 transition font-semibold">
                      View Profile
                    </button>
                    <button className="py-2 bg-accent text-white rounded-lg hover:opacity-90 transition font-semibold">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No doctors found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
