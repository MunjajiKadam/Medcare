import bcrypt from 'bcryptjs';
import { executeQuery } from '../config/database.js';

const email = 'admin@medcare.com';
const plaintext = 'admin123';

async function run() {
  try {
    const rows = await executeQuery('SELECT password FROM users WHERE email = ?', [email]);
    if (!rows || rows.length === 0) {
      console.error('No user found');
      process.exit(2);
    }
    const hash = rows[0].password;
    const ok = await bcrypt.compare(plaintext, hash);
    console.log('bcrypt.compare result:', ok);
    console.log('hash length:', hash.length);
    console.log('hash head:', hash.slice(0, 8));
    console.log('hash tail:', hash.slice(-8));
    if (!ok) {
      console.log('Stored hash:', hash);
      console.log('char codes tail:', hash.slice(-8).split('').map(c => c.charCodeAt(0)));
    }
    // Sanity test: create a new hash for plaintext and compare
    const newHash = bcrypt.hashSync(plaintext, 10);
    const sanity = await bcrypt.compare(plaintext, newHash);
    console.log('sanity newHash compare (should be true):', sanity);
    console.log('newHash tail:', newHash.slice(-8));
    process.exit(ok ? 0 : 3);
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
}

run();
