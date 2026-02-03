import { executeQuery } from '../config/database.js';

async function checkAppointmentTable() {
  try {
    console.log('🔍 Checking appointments table structure...\n');
    
    const columns = await executeQuery(
      "SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='medcare_db' AND TABLE_NAME='appointments'"
    );

    console.log('📋 Appointments Table Columns:');
    columns.forEach(col => {
      console.log(`  ✓ ${col.COLUMN_NAME}: ${col.COLUMN_TYPE} (Nullable: ${col.IS_NULLABLE})`);
    });

    // Check for status column specifically
    const hasStatus = columns.some(col => col.COLUMN_NAME === 'status');
    console.log(`\n✅ Status column exists: ${hasStatus ? 'YES' : 'NO'}`);

    // Get a sample appointment
    const appointments = await executeQuery(
      'SELECT id, status FROM appointments LIMIT 1'
    );

    if (appointments.length > 0) {
      console.log(`\n📝 Sample appointment:`, appointments[0]);
    } else {
      console.log('\n⚠️ No appointments in database yet');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkAppointmentTable();
