import mysql from 'mysql2/promise';

async function addVikrantData() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'manju123',
      database: 'medcare_db'
    });

    console.log('📊 Adding data for Dr. Vikrant Singh...\n');

    // Get Dr. Vikrant's IDs
    const [doctorUser] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      ['vikrant@medcare.com']
    );

    if (doctorUser.length === 0) {
      console.log('❌ Dr. Vikrant Singh not found!');
      await connection.end();
      return;
    }

    const doctorUserId = doctorUser[0].id;

    const [doctorRecord] = await connection.execute(
      'SELECT id, specialization FROM doctors WHERE user_id = ?',
      [doctorUserId]
    );

    if (doctorRecord.length === 0) {
      console.log('❌ Doctor record not found!');
      await connection.end();
      return;
    }

    const doctorId = doctorRecord[0].id;
    const specialization = doctorRecord[0].specialization;

    console.log(`✅ Found Dr. Vikrant Singh (User ID: ${doctorUserId}, Doctor ID: ${doctorId})`);
    console.log(`   Specialization: ${specialization}\n`);

    // Get or create some patient IDs
    const [patients] = await connection.execute(
      'SELECT id, user_id FROM patients LIMIT 5'
    );

    if (patients.length === 0) {
      console.log('❌ No patients found in database!');
      await connection.end();
      return;
    }

    console.log(`📋 Found ${patients.length} patients\n`);

    // Add appointments for Dr. Vikrant
    const appointments = [
      { patientId: patients[0].id, date: '2026-02-05', time: '09:00', reason: 'General Checkup', symptoms: 'Routine health check', status: 'scheduled' },
      { patientId: patients[1].id, date: '2026-02-06', time: '10:30', reason: 'Follow-up Consultation', symptoms: 'Previous treatment review', status: 'scheduled' },
      { patientId: patients[2].id, date: '2026-02-07', time: '14:00', reason: 'Cardiology Consultation', symptoms: 'Chest pain, breathlessness', status: 'scheduled' },
      { patientId: patients[3].id, date: '2026-01-28', time: '11:00', reason: 'Blood Pressure Check', symptoms: 'Hypertension monitoring', status: 'completed' },
      { patientId: patients[0].id, date: '2026-01-25', time: '15:30', reason: 'Diabetes Consultation', symptoms: 'Blood sugar management', status: 'completed' },
      { patientId: patients[1].id, date: '2026-02-08', time: '16:00', reason: 'Heart Health Review', symptoms: 'ECG abnormality follow-up', status: 'scheduled' },
    ];

    console.log('📅 Adding appointments...');
    for (const apt of appointments) {
      await connection.execute(
        'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason_for_visit, symptoms, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [apt.patientId, doctorId, apt.date, apt.time, apt.reason, apt.symptoms, apt.status]
      );
    }
    console.log(`   ✅ Added ${appointments.length} appointments\n`);

    // Get the appointment IDs for prescriptions
    const [newAppointments] = await connection.execute(
      'SELECT id, patient_id, status FROM appointments WHERE doctor_id = ? ORDER BY id DESC LIMIT 6',
      [doctorId]
    );

    // Add prescriptions for completed appointments
    console.log('💊 Adding prescriptions...');
    const prescriptions = [
      { 
        aptId: newAppointments[3].id, 
        patientId: newAppointments[3].patient_id,
        medications: 'Metoprolol, Aspirin',
        dosage: '50mg daily, 100mg daily',
        duration: '30 days',
        instructions: 'Take Metoprolol in morning, Aspirin after dinner'
      },
      {
        aptId: newAppointments[4].id,
        patientId: newAppointments[4].patient_id,
        medications: 'Metformin, Glimepiride',
        dosage: '500mg twice daily, 2mg daily',
        duration: '30 days',
        instructions: 'Take with meals, monitor blood sugar levels'
      }
    ];

    for (const rx of prescriptions) {
      await connection.execute(
        'INSERT INTO prescriptions (appointment_id, doctor_id, patient_id, medications, dosage, duration, instructions) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [rx.aptId, doctorId, rx.patientId, rx.medications, rx.dosage, rx.duration, rx.instructions]
      );
    }
    console.log(`   ✅ Added ${prescriptions.length} prescriptions\n`);

    // Add reviews for Dr. Vikrant
    console.log('⭐ Adding reviews...');
    const reviews = [
      { patientId: patients[0].user_id, rating: 5, comment: 'Excellent doctor! Very thorough and caring. Highly recommend!' },
      { patientId: patients[1].user_id, rating: 5, comment: 'Best cardiologist I have consulted. Very knowledgeable and patient.' },
      { patientId: patients[2].user_id, rating: 4, comment: 'Good experience overall. Doctor explained everything clearly.' },
      { patientId: patients[3].user_id, rating: 5, comment: 'Outstanding service! Very professional and compassionate.' },
    ];

    for (const review of reviews) {
      await connection.execute(
        'INSERT INTO reviews (doctor_id, patient_id, rating, review_text) VALUES (?, ?, ?, ?)',
        [doctorId, review.patientId, review.rating, review.comment]
      );
    }
    console.log(`   ✅ Added ${reviews.length} reviews\n`);

    // Add time slots
    console.log('🕐 Adding time slots...');
    const timeSlots = [
      { day: 'Monday', start: '09:00', end: '17:00' },
      { day: 'Tuesday', start: '09:00', end: '17:00' },
      { day: 'Wednesday', start: '10:00', end: '18:00' },
      { day: 'Thursday', start: '09:00', end: '17:00' },
      { day: 'Friday', start: '09:00', end: '15:00' },
      { day: 'Saturday', start: '10:00', end: '13:00' },
    ];

    // Clear existing time slots first
    await connection.execute('DELETE FROM doctor_time_slots WHERE doctor_id = ?', [doctorId]);

    for (const slot of timeSlots) {
      await connection.execute(
        'INSERT INTO doctor_time_slots (doctor_id, day_of_week, start_time, end_time, is_available) VALUES (?, ?, ?, ?, 1)',
        [doctorId, slot.day, slot.start, slot.end]
      );
    }
    console.log(`   ✅ Added ${timeSlots.length} time slots\n`);

    // Show summary
    const [stats] = await connection.execute(`
      SELECT 
        (SELECT COUNT(*) FROM appointments WHERE doctor_id = ?) as total_appointments,
        (SELECT COUNT(*) FROM appointments WHERE doctor_id = ? AND status = 'scheduled') as upcoming_appointments,
        (SELECT COUNT(*) FROM appointments WHERE doctor_id = ? AND status = 'completed') as completed_appointments,
        (SELECT COUNT(*) FROM prescriptions WHERE doctor_id = ?) as total_prescriptions,
        (SELECT COUNT(*) FROM reviews WHERE doctor_id = ?) as total_reviews,
        (SELECT AVG(rating) FROM reviews WHERE doctor_id = ?) as avg_rating
    `, [doctorId, doctorId, doctorId, doctorId, doctorId, doctorId]);

    console.log('📊 Summary for Dr. Vikrant Singh:');
    console.log('   📅 Total Appointments:', stats[0].total_appointments);
    console.log('   🔜 Upcoming Appointments:', stats[0].upcoming_appointments);
    console.log('   ✅ Completed Appointments:', stats[0].completed_appointments);
    console.log('   💊 Total Prescriptions:', stats[0].total_prescriptions);
    console.log('   ⭐ Total Reviews:', stats[0].total_reviews);
    console.log('   ⭐ Average Rating:', parseFloat(stats[0].avg_rating).toFixed(1));

    console.log('\n✅ Data successfully added for Dr. Vikrant Singh!');
    console.log('\n🔐 Login credentials:');
    console.log('   Email: vikrant@medcare.com');
    console.log('   Password: doctor123');

    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addVikrantData();
