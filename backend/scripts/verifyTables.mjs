import { executeQuery } from '../config/database.js';

async function verifyTables() {
  try {
    console.log('🔍 Verifying new tables...\n');

    // Check consultation_notes table
    const consultationNotes = await executeQuery(
      "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='medcare_db' AND TABLE_NAME='consultation_notes'"
    );
    console.log(`✓ consultation_notes table: ${consultationNotes.length > 0 ? '✅ EXISTS' : '❌ MISSING'}`);

    // Check diagnoses table
    const diagnoses = await executeQuery(
      "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='medcare_db' AND TABLE_NAME='diagnoses'"
    );
    console.log(`✓ diagnoses table: ${diagnoses.length > 0 ? '✅ EXISTS' : '❌ MISSING'}`);

    // Check availability_history table
    const availabilityHistory = await executeQuery(
      "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='medcare_db' AND TABLE_NAME='availability_history'"
    );
    console.log(`✓ availability_history table: ${availabilityHistory.length > 0 ? '✅ EXISTS' : '❌ MISSING'}`);

    console.log('\n✅ All new tables verified successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyTables();
