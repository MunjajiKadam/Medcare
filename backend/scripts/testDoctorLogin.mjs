import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

async function testDoctorLogin() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'manju123',
      database: 'medcare_db'
    });

    const email = 'john@medcare.com'; // Test with first doctor
    const password = 'doctor123'; // Common password
    
    console.log(`📤 Testing login for: ${email}`);
    console.log(`🔑 Password attempt: ${password}\n`);
    
    const [users] = await connection.execute(
      'SELECT id, name, email, password, role, status FROM users WHERE email = ? AND role = ?',
      [email, 'doctor']
    );
    
    if (users.length === 0) {
      console.log('❌ User not found with email and role "doctor"');
      await connection.end();
      return;
    }
    
    const user = users[0];
    console.log('✅ User found:');
    console.log('   ID:', user.id);
    console.log('   Name:', user.name);
    console.log('   Email:', user.email);
    console.log('   Role:', user.role);
    console.log('   Status:', user.status);
    console.log('   Password Hash:', user.password.substring(0, 30) + '...\n');
    
    // Test password
    const isValid = await bcrypt.compare(password, user.password);
    console.log(`🔐 Password "${password}" is:`, isValid ? '✅ VALID' : '❌ INVALID');
    
    if (!isValid) {
      // Try other common passwords
      const testPasswords = ['123456', 'password', 'admin123'];
      console.log('\n🔄 Testing other common passwords...');
      for (const testPwd of testPasswords) {
        const isMatch = await bcrypt.compare(testPwd, user.password);
        if (isMatch) {
          console.log(`   ✅ Password "${testPwd}" works!`);
        }
      }
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testDoctorLogin();
