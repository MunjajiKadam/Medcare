import { executeQuery } from '../config/database.js';

const email = 'admin@medcare.com';

async function run() {
  try {
    const rows = await executeQuery('SELECT id, name, email, password, role, status FROM users WHERE email = ?', [email]);
    console.log(JSON.stringify(rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Query failed:', err.message || err);
    process.exit(1);
  }
}

run();
