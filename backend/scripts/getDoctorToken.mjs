import { executeQuery } from '../config/database.js';

async function getValidToken() {
  try {
    // Get a doctor from the database
    const doctors = await executeQuery(`
      SELECT u.id, u.email, u.password, d.id as doctor_id 
      FROM users u 
      JOIN doctors d ON d.user_id = u.id 
      WHERE u.role = 'doctor' 
      LIMIT 1
    `);

    if (doctors.length === 0) {
      console.log('❌ No doctors found in database');
      process.exit(0);
    }

    const doctor = doctors[0];
    console.log('👨‍⚕️ Doctor found:');
    console.log('  User ID:', doctor.id);
    console.log('  Email:', doctor.email);
    console.log('  Doctor ID:', doctor.doctor_id);

    // Get an appointment for this doctor
    const appointments = await executeQuery(`
      SELECT * FROM appointments 
      WHERE doctor_id = ? AND status = 'scheduled'
      LIMIT 1
    `, [doctor.doctor_id]);

    if (appointments.length === 0) {
      console.log('⚠️ No scheduled appointments found for this doctor');
      process.exit(0);
    }

    console.log('\n📅 Appointment found:');
    console.log('  ID:', appointments[0].id);
    console.log('  Status:', appointments[0].status);
    console.log('  Patient ID:', appointments[0].patient_id);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

getValidToken();
