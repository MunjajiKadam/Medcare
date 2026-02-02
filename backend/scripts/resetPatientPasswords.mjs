import bcrypt from 'bcryptjs';
import { executeQuery } from '../config/database.js';

const patients = [
  { email: 'manju@example.com', password: 'patient123' }
];

async function run() {
  try {
    for (const patient of patients) {
      const newHash = bcrypt.hashSync(patient.password, 10);
      const result = await executeQuery(
        'UPDATE users SET password = ? WHERE email = ? AND role = ?',
        [newHash, patient.email, 'patient']
      );
      console.log(`Updated ${patient.email}: ${result.affectedRows || result.affected_rows || 0} rows`);
    }
    console.log('All patient passwords reset successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Update failed:', err.message || err);
    process.exit(1);
  }
}

run();
