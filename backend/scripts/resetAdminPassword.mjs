import bcrypt from 'bcryptjs';
import { executeQuery } from '../config/database.js';

const email = 'admin@medcare.com';
const plaintext = 'admin123';

async function run() {
  try {
    const newHash = bcrypt.hashSync(plaintext, 10);
    const result = await executeQuery('UPDATE users SET password = ? WHERE email = ?', [newHash, email]);
    console.log('Updated rows:', result.affectedRows || result.affected_rows || result.affectedRows === 0 ? result.affectedRows : result);
    process.exit(0);
  } catch (err) {
    console.error('Update failed:', err.message || err);
    process.exit(1);
  }
}

run();
