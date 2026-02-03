import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

async function resetDoctorPasswords() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'manju123',
      database: 'medcare_db'
    });

    const newPassword = 'doctor123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    console.log('🔄 Resetting all doctor passwords to: doctor123');
    console.log(`🔑 Hashed password: ${hashedPassword}\n`);
    
    const [result] = await connection.execute(
      'UPDATE users SET password = ? WHERE role = "doctor"',
      [hashedPassword]
    );
    
    console.log(`✅ Updated ${result.affectedRows} doctor accounts`);
    
    // Verify update
    const [doctors] = await connection.execute(
      'SELECT id, name, email FROM users WHERE role = "doctor"'
    );
    
    console.log('\n📋 Updated doctor accounts:');
    doctors.forEach(doc => {
      console.log(`   ✅ ${doc.name} (${doc.email})`);
    });
    
    console.log('\n✅ All doctor passwords reset to: doctor123');
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

resetDoctorPasswords();
