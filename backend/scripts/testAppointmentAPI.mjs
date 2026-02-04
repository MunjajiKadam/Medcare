import mysql from 'mysql2/promise';

async function testAPI() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'manju123',
    database: 'medcare_db'
  });

  console.log('\n🔍 Testing Appointment Queries...\n');

  // Test 1: Get all appointments for "Manju Patient"
  console.log('📋 Test 1: Patient View (Manju Patient - manju@example.com)');
  const [manpat] = await conn.execute('SELECT id FROM users WHERE email = ?', ['manju@example.com']);
  if (manpat.length > 0) {
    const userId = manpat[0].id;
    console.log(`  User ID: ${userId}`);
    
    const [patient] = await conn.execute('SELECT id FROM patients WHERE user_id = ?', [userId]);
    if (patient.length > 0) {
      console.log(`  Patient ID: ${patient[0].id}`);
      
      const [apts] = await conn.execute(`
        SELECT a.*, d.specialization, u.name as doctor_name 
        FROM appointments a 
        JOIN doctors d ON a.doctor_id = d.id 
        JOIN users u ON d.user_id = u.id 
        WHERE a.patient_id = ? 
        ORDER BY a.appointment_date DESC
      `, [patient[0].id]);
      
      console.log(`  ✅ Found ${apts.length} appointments:`);
      apts.forEach(apt => {
        console.log(`     - ID: ${apt.id}, Doctor: ${apt.doctor_name}, Date: ${apt.appointment_date}, Status: ${apt.status}`);
      });
    } else {
      console.log('  ❌ No patient record found!');
    }
  }

  // Test 2: Get all appointments for "Dr. Manjudoctor"
  console.log('\n📋 Test 2: Doctor View (Dr. Manjudoctor - manjudoctor@example.com)');
  const [mandoc] = await conn.execute('SELECT id FROM users WHERE email = ?', ['manjudoctor@example.com']);
  if (mandoc.length > 0) {
    const userId = mandoc[0].id;
    console.log(`  User ID: ${userId}`);
    
    const [doctor] = await conn.execute('SELECT id FROM doctors WHERE user_id = ?', [userId]);
    if (doctor.length > 0) {
      console.log(`  Doctor ID: ${doctor[0].id}`);
      
      const [apts] = await conn.execute(`
        SELECT a.*, u.name as patient_name, p.blood_type 
        FROM appointments a 
        JOIN patients p ON a.patient_id = p.id 
        JOIN users u ON p.user_id = u.id 
        WHERE a.doctor_id = ? 
        ORDER BY a.appointment_date DESC
      `, [doctor[0].id]);
      
      console.log(`  ✅ Found ${apts.length} appointments:`);
      apts.forEach(apt => {
        console.log(`     - ID: ${apt.id}, Patient: ${apt.patient_name}, Date: ${apt.appointment_date}, Status: ${apt.status}`);
      });
    } else {
      console.log('  ❌ No doctor record found!');
    }
  }

  // Test 3: Get all appointments for "Dr. Manju"
  console.log('\n📋 Test 3: Doctor View (Dr. Manju - manjudoctor@medcare.com)');
  const [mandoc2] = await conn.execute('SELECT id FROM users WHERE email = ?', ['manjudoctor@medcare.com']);
  if (mandoc2.length > 0) {
    const userId = mandoc2[0].id;
    console.log(`  User ID: ${userId}`);
    
    const [doctor] = await conn.execute('SELECT id FROM doctors WHERE user_id = ?', [userId]);
    if (doctor.length > 0) {
      console.log(`  Doctor ID: ${doctor[0].id}`);
      
      const [apts] = await conn.execute(`
        SELECT a.*, u.name as patient_name, p.blood_type 
        FROM appointments a 
        JOIN patients p ON a.patient_id = p.id 
        JOIN users u ON p.user_id = u.id 
        WHERE a.doctor_id = ? 
        ORDER BY a.appointment_date DESC
      `, [doctor[0].id]);
      
      console.log(`  ✅ Found ${apts.length} appointments:`);
      apts.forEach(apt => {
        console.log(`     - ID: ${apt.id}, Patient: ${apt.patient_name}, Date: ${apt.appointment_date}, Status: ${apt.status}`);
      });
    } else {
      console.log('  ❌ No doctor record found!');
    }
  }

  await conn.end();
}

testAPI().catch(console.error);
