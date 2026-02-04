import mysql from 'mysql2/promise';

async function checkAppointments() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'manju123',
    database: 'medcare_db'
  });

  console.log('\n📅 Checking Recent Appointments...\n');

  const [appointments] = await conn.execute(`
    SELECT 
      a.id, 
      a.appointment_date, 
      a.appointment_time, 
      a.status,
      a.created_at,
      u1.name as patient_name,
      u1.email as patient_email,
      u2.name as doctor_name,
      u2.email as doctor_email
    FROM appointments a
    JOIN patients p ON a.patient_id = p.id
    JOIN users u1 ON p.user_id = u1.id
    JOIN doctors d ON a.doctor_id = d.id
    JOIN users u2 ON d.user_id = u2.id
    ORDER BY a.created_at DESC
    LIMIT 20
  `);

  if (appointments.length === 0) {
    console.log('❌ No appointments found in database!');
  } else {
    console.log(`✅ Found ${appointments.length} appointments:\n`);
    appointments.forEach(apt => {
      console.log(`  📋 ID: ${apt.id}`);
      console.log(`     👤 Patient: ${apt.patient_name} (${apt.patient_email})`);
      console.log(`     👨‍⚕️ Doctor: ${apt.doctor_name} (${apt.doctor_email})`);
      console.log(`     📅 Date: ${apt.appointment_date} at ${apt.appointment_time}`);
      console.log(`     📊 Status: ${apt.status}`);
      console.log(`     🕐 Created: ${apt.created_at}`);
      console.log('');
    });
  }

  // Check for "manju" doctor specifically
  const [manjuDocs] = await conn.execute(`
    SELECT u.name, u.email, d.id as doctor_id
    FROM doctors d
    JOIN users u ON d.user_id = u.id
    WHERE u.name LIKE '%manju%' OR u.email LIKE '%manju%'
  `);

  if (manjuDocs.length > 0) {
    console.log('\n👨‍⚕️ Found Manju Doctor:');
    manjuDocs.forEach(doc => {
      console.log(`  Name: ${doc.name}, Email: ${doc.email}, Doctor ID: ${doc.doctor_id}`);
    });

    // Check appointments for this doctor
    const [manjuApts] = await conn.execute(`
      SELECT 
        a.id, 
        a.appointment_date, 
        a.appointment_time, 
        a.status,
        u.name as patient_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE a.doctor_id = ?
      ORDER BY a.created_at DESC
    `, [manjuDocs[0].doctor_id]);

    console.log(`\n📅 Appointments with Dr. ${manjuDocs[0].name}: ${manjuApts.length}`);
    manjuApts.forEach(apt => {
      console.log(`  - ${apt.patient_name} on ${apt.appointment_date} at ${apt.appointment_time} (${apt.status})`);
    });
  } else {
    console.log('\n⚠️ No doctor found with name "manju"');
  }

  await conn.end();
}

checkAppointments().catch(console.error);
