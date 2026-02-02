import { executeQuery } from '../config/database.js';

async function insertDummyData() {
  try {
    console.log('🔄 Starting to insert dummy data...');

    // First, insert users (if not already there)
    console.log('📝 Checking/Inserting users...');
    try {
      await executeQuery(`
        INSERT INTO users (name, email, password, role, phone, status) VALUES
        ('Dr. Manjudoctor', 'manjudoctor@example.com', '$2a$10$HMbh9xPVE5T1.uJ2yPKSUOY9KyZDLMzrA8Cv0iKg2N4L2VJ0EIPQ2', 'doctor', '9876543210', 'active'),
        ('Dr. Orthopedist', 'orthopedist@example.com', '$2a$10$GVvJ/ixKnRDhP5xDvXQvGOwTb7D5iHa9OJ5Rb2Kt5E8xN9H8K0L6O', 'doctor', '9876543211', 'active'),
        ('Manju Patient', 'manju@example.com', '$2a$10$L5nYrQs8E9j5D2kK3vP0F.YeKmWvXrT4I7nP2jQ9s8e6vX3hY1N4C', 'patient', '9123456789', 'active'),
        ('John Doe', 'john@example.com', '$2a$10$L5nYrQs8E9j5D2kK3vP0F.YeKmWvXrT4I7nP2jQ9s8e6vX3hY1N4C', 'patient', '9123456790', 'active')
      `);
      console.log('✅ Users created');
    } catch (err) {
      console.log('⚠️  Users might already exist, continuing...');
    }

    // Insert doctors
    console.log('📝 Inserting doctors...');
    try {
      await executeQuery(`
        INSERT INTO doctors (user_id, specialization, license_number, experience_years, bio, availability_status) VALUES
        (2, 'Cardiology', 'LIC001', 10, 'Expert in heart diseases and cardiovascular care', 'available'),
        (3, 'Orthopedics', 'LIC002', 8, 'Specialist in bone and joint issues', 'available')
      `);
      console.log('✅ Doctors inserted');
    } catch (err) {
      console.log('⚠️  Doctors might already exist, continuing...');
    }

    // Insert patients
    console.log('📝 Inserting patients...');
    try {
      await executeQuery(`
        INSERT INTO patients (user_id, date_of_birth, blood_type, medical_history, emergency_phone) VALUES
        (4, '1990-05-15', 'O+', 'No known allergies', '9123456780'),
        (5, '1985-08-22', 'B+', 'Diabetic, managed with medication', '9123456781')
      `);
      console.log('✅ Patients inserted');
    } catch (err) {
      console.log('⚠️  Patients might already exist, continuing...');
    }

    // Insert appointments
    console.log('📝 Inserting appointments...');
    try {
      await executeQuery(`
        INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason_for_visit, status, notes) VALUES
        (1, 1, '2026-02-10', '10:00:00', 'Chest pain checkup', 'completed', 'Patient reported chest pain, ECG normal'),
        (2, 2, '2026-02-11', '14:30:00', 'Knee pain consultation', 'scheduled', 'Follow-up from previous injury'),
        (1, 2, '2026-02-12', '11:00:00', 'Regular orthopedic checkup', 'completed', 'Patient doing well, follow-up in 3 months')
      `);
      console.log('✅ Appointments inserted');
    } catch (err) {
      console.log('⚠️  Appointments might already exist, continuing...');
    }

    // Insert health records
    console.log('📝 Inserting health records...');
    try {
      await executeQuery(`
        INSERT INTO health_records (patient_id, record_type, record_value, record_date) VALUES
        (1, 'Blood Pressure', '120/80 mmHg', '2026-02-01'),
        (1, 'Glucose Level', '95 mg/dL', '2026-02-01'),
        (1, 'Heart Rate', '72 bpm', '2026-02-01'),
        (2, 'Blood Pressure', '140/90 mmHg', '2026-02-01'),
        (2, 'Glucose Level', '180 mg/dL', '2026-02-01'),
        (2, 'Weight', '75 kg', '2026-02-01')
      `);
      console.log('✅ Health records inserted');
    } catch (err) {
      console.log('⚠️  Health records might already exist, continuing...');
    }

    // Insert prescriptions
    console.log('📝 Inserting prescriptions...');
    try {
      await executeQuery(`
        INSERT INTO prescriptions (appointment_id, doctor_id, patient_id, medications, dosage, duration, instructions) VALUES
        (1, 1, 1, 'Aspirin', '75mg', '30 days', 'Take one tablet daily after meals'),
        (1, 1, 1, 'Atorvastatin', '20mg', '60 days', 'Take one tablet at night'),
        (2, 2, 2, 'Metformin', '500mg', '90 days', 'Take twice daily with meals'),
        (3, 2, 1, 'Paracetamol', '500mg', '7 days', 'Take as needed for pain, max 4 times daily')
      `);
      console.log('✅ Prescriptions inserted');
    } catch (err) {
      console.log('⚠️  Prescriptions might already exist, continuing...');
    }

    // Insert reviews
    console.log('📝 Inserting reviews...');
    try {
      await executeQuery(`
        INSERT INTO reviews (doctor_id, patient_id, rating, review_text) VALUES
        (1, 1, 5, 'Dr. Manjudoctor is very professional and caring. Explained everything clearly and took time to address all my concerns.'),
        (2, 2, 4, 'Great service and treatment. Would have given 5 stars but had to wait a bit for the appointment.'),
        (2, 1, 5, 'Excellent orthopedic treatment. Pain relief was immediate and Dr. provided detailed exercises for recovery.')
      `);
      console.log('✅ Reviews inserted');
    } catch (err) {
      console.log('⚠️  Reviews might already exist, continuing...');
    }

    // Insert time slots
    console.log('📝 Inserting time slots...');
    try {
      await executeQuery(`
        INSERT INTO doctor_time_slots (doctor_id, day_of_week, start_time, end_time, is_available) VALUES
        (1, 'Monday', '09:00:00', '12:00:00', true),
        (1, 'Monday', '14:00:00', '17:00:00', true),
        (1, 'Wednesday', '09:00:00', '12:00:00', true),
        (1, 'Friday', '14:00:00', '17:00:00', true),
        (2, 'Tuesday', '10:00:00', '13:00:00', true),
        (2, 'Tuesday', '15:00:00', '18:00:00', true),
        (2, 'Thursday', '10:00:00', '13:00:00', true),
        (2, 'Saturday', '09:00:00', '12:00:00', true)
      `);
      console.log('✅ Time slots inserted');
    } catch (err) {
      console.log('⚠️  Time slots might already exist, continuing...');
    }

    console.log('\n✅ All dummy data setup complete!');
    console.log('\n📊 Summary:');
    console.log('   - Doctors: 2 (Cardiology, Orthopedics)');
    console.log('   - Patients: 2');
    console.log('   - Appointments: 3');
    console.log('   - Health Records: 6');
    console.log('   - Prescriptions: 4');
    console.log('   - Reviews: 3');
    console.log('   - Time Slots: 8');
    console.log('\n🔑 Test Credentials:');
    console.log('   Admin: admin@example.com / admin123');
    console.log('   Doctor: manjudoctor@example.com / doctor123');
    console.log('   Patient: manju@example.com / patient123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

insertDummyData();
