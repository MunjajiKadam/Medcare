// Script to add an admin user with bcrypt-hashed password

import bcrypt from 'bcrypt';
import db from '../config/database.js';

const adminEmail = 'admin@example.com';
const adminPassword = 'admin123';
const adminRole = 'admin';
const adminName = 'Admin';

async function addAdmin() {
  try {
    // Check if admin already exists
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [adminEmail]);
    if (existing.length > 0) {
      console.log('Admin user already exists.');
      return;
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    // Insert admin user
    await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [adminName, adminEmail, hashedPassword, adminRole]
    );
    console.log('Admin user added successfully.');
  } catch (err) {
    console.error('Error adding admin:', err);
  } finally {
    db.end();
  }
}

addAdmin();
