import mysql from 'mysql2/promise';

async function checkDoctors() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'manju123',
      database: 'medcare_db'
    });

    console.log('📊 Checking doctor accounts...\n');
    
    const [doctors] = await connection.execute(
      'SELECT id, name, email, role, status FROM users WHERE role = "doctor"'
    );
    
    console.log('Doctor Accounts Found:', doctors.length);
    console.table(doctors);
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkDoctors();
