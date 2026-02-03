import axios from './axios';

// Doctor API calls
export const doctorAPI = {
  // Get all doctors
  getAllDoctors: () => axios.get('/doctors'),

  // Get doctor by ID
  getDoctorById: (id) => axios.get(`/doctors/${id}`),

  // Get doctors by specialization
  getDoctorsBySpecialization: (specialization) =>
    axios.get(`/doctors/specialty/${specialization}`),

  // Get doctor reviews
  getDoctorReviews: (doctorId) => axios.get(`/doctors/${doctorId}/reviews`),

  // Get current doctor profile (protected)
  getProfile: () => axios.get('/doctors/profile/me'),

  // Get doctor profile (protected)
  getDoctorProfile: (doctorId) => axios.get(`/doctors/profile/${doctorId}`),

  // Update doctor profile (protected)
  updateDoctorProfile: (doctorId, data) =>
    axios.put(`/doctors/profile/${doctorId}`, data),

  // Admin - Update doctor
  updateDoctorAdmin: (doctorId, data) =>
    axios.put(`/doctors/admin/${doctorId}`, data),
};

// Appointment API calls
export const appointmentAPI = {
  // Create appointment
  createAppointment: (data) => axios.post('/appointments', data),

  // Get all appointments
  getAppointments: () => axios.get('/appointments'),

  // Get appointment by ID
  getAppointmentById: (id) => axios.get(`/appointments/${id}`),

  // Update appointment
  updateAppointment: (id, data) => axios.put(`/appointments/${id}`, data),

  // Cancel appointment
  cancelAppointment: (id) => axios.delete(`/appointments/${id}`),

  // Admin - Get all appointments
  getAllAppointmentsAdmin: () => axios.get('/appointments/admin/all'),

  // Admin - Update appointment
  updateAppointmentAdmin: (id, data) => axios.put(`/appointments/admin/${id}`, data),

  // Admin - Delete appointment
  deleteAppointmentAdmin: (id) => axios.delete(`/appointments/admin/${id}`),
};

// Patient API calls
export const patientAPI = {
  getAllPatients: () => axios.get('/patients'),
  getPatientById: (id) => axios.get(`/patients/${id}`),
  getPatientProfile: () => axios.get('/patients/profile'),
  updatePatientProfile: (data) => axios.put('/patients/profile', data),
  updatePersonalInfo: (data) => axios.put('/patients/personal-info', data),
  deletePatient: (id) => axios.delete(`/patients/${id}`),

  // Admin - Update patient
  updatePatientAdmin: (id, data) => axios.put(`/patients/admin/${id}`, data),
};

// Health Record API calls
export const healthRecordAPI = {
  createHealthRecord: (data) => axios.post('/health-records', data),
  getHealthRecords: () => axios.get('/health-records'),
  getHealthRecordById: (id) => axios.get(`/health-records/${id}`),
  updateHealthRecord: (id, data) => axios.put(`/health-records/${id}`, data),
  deleteHealthRecord: (id) => axios.delete(`/health-records/${id}`),

  // Admin - Get all health records
  getAllHealthRecordsAdmin: () => axios.get('/health-records/admin/all'),

  // Admin - Update health record
  updateHealthRecordAdmin: (id, data) => axios.put(`/health-records/admin/${id}`, data),

  // Admin - Delete health record
  deleteHealthRecordAdmin: (id) => axios.delete(`/health-records/admin/${id}`),
};

// Prescription API calls
export const prescriptionAPI = {
  createPrescription: (data) => axios.post('/prescriptions', data),
  getPrescriptions: () => axios.get('/prescriptions'),
  getPrescriptionById: (id) => axios.get(`/prescriptions/${id}`),
  updatePrescription: (id, data) => axios.put(`/prescriptions/${id}`, data),
  deletePrescription: (id) => axios.delete(`/prescriptions/${id}`),

  // Admin - Get all prescriptions
  getAllPrescriptionsAdmin: () => axios.get('/prescriptions/admin/all'),

  // Admin - Update prescription
  updatePrescriptionAdmin: (id, data) => axios.put(`/prescriptions/admin/${id}`, data),

  // Admin - Delete prescription
  deletePrescriptionAdmin: (id) => axios.delete(`/prescriptions/admin/${id}`),
};

// Review API calls
export const reviewAPI = {
  createReview: (data) => axios.post('/reviews', data),
  getReviews: () => axios.get('/reviews'),
  getReviewsByDoctor: (doctorId) => axios.get(`/reviews/doctor/${doctorId}`),
  updateReview: (id, data) => axios.put(`/reviews/${id}`, data),
  deleteReview: (id) => axios.delete(`/reviews/${id}`),

  // Admin - Get all reviews
  getAllReviewsAdmin: () => axios.get('/reviews/admin/all'),

  // Admin - Delete review
  deleteReviewAdmin: (id) => axios.delete(`/reviews/admin/${id}`),
};

// Time Slot API calls
export const timeSlotAPI = {
  createTimeSlot: (data) => axios.post('/time-slots', data),
  getTimeSlots: (params) => axios.get('/time-slots', { params }),
  getTimeSlotById: (id) => axios.get(`/time-slots/${id}`),
  updateTimeSlot: (id, data) => axios.put(`/time-slots/${id}`, data),
  deleteTimeSlot: (id) => axios.delete(`/time-slots/${id}`),

  // Admin - Get all time slots
  getAllTimeSlotsAdmin: () => axios.get('/time-slots/admin/all'),

  // Admin - Update time slot
  updateTimeSlotAdmin: (id, data) => axios.put(`/time-slots/admin/${id}`, data),

  // Admin - Delete time slot
  deleteTimeSlotAdmin: (id) => axios.delete(`/time-slots/admin/${id}`),
};

// Consultation Notes API calls
export const consultationNotesAPI = {
  createConsultationNotes: (data) => axios.post('/consultation-notes', data),
  getConsultationNotes: () => axios.get('/consultation-notes'),
  getConsultationNotesByAppointment: (appointmentId) => axios.get(`/consultation-notes/appointment/${appointmentId}`),
  updateConsultationNotes: (id, data) => axios.put(`/consultation-notes/${id}`, data),
};

// Diagnosis API calls
export const diagnosisAPI = {
  createDiagnosis: (data) => axios.post('/diagnoses', data),
  getDiagnoses: () => axios.get('/diagnoses'),
  getDiagnosisByAppointment: (appointmentId) => axios.get(`/diagnoses/appointment/${appointmentId}`),
  updateDiagnosis: (id, data) => axios.put(`/diagnoses/${id}`, data),
  deleteDiagnosis: (id) => axios.delete(`/diagnoses/${id}`),
};

// Availability API calls
export const availabilityAPI = {
  getDoctorAvailability: (doctorId) => axios.get(`/availability/doctor/${doctorId}`),
  updateAvailabilityStatus: (data) => axios.put('/availability/status', data),
  getAvailabilityHistory: () => axios.get('/availability/history'),
  upsertTimeSlot: (data) => axios.post('/availability/time-slot', data),
  toggleTimeSlotAvailability: (slotId, data) => axios.put(`/availability/time-slot/${slotId}/toggle`, data),
  deleteTimeSlot: (slotId) => axios.delete(`/availability/time-slot/${slotId}`),
};

export default axios;
