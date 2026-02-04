import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { executeQuery } from '../config/database.js';

// Register User
export const register = async (req, res) => {
  try {
    const { name, email, password, role, specialization, experienceYears, consultationFee, licenseNumber } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Doctor-specific validation
    if (role === 'doctor') {
      if (!specialization || !licenseNumber || !experienceYears || !consultationFee) {
        return res.status(400).json({ message: 'All doctor fields are required (specialization, license number, experience, and consultation fee)' });
      }
    }

    // Check if user already exists
    const existingUser = await executeQuery('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await executeQuery(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    const userId = result.insertId;

    // Create role-specific record
    if (role === 'patient') {
      await executeQuery('INSERT INTO patients (user_id) VALUES (?)', [userId]);
    } else if (role === 'doctor') {
      await executeQuery(
        'INSERT INTO doctors (user_id, specialization, experience_years, consultation_fee, license_number) VALUES (?, ?, ?, ?, ?)', 
        [userId, specialization, experienceYears, consultationFee, licenseNumber]
      );
    }

    // Generate token
    const token = jwt.sign(
      { id: userId, email, role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: userId, name, email, role, theme: 'light' }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    console.log('🔐 [LOGIN] Attempting login:', { email, role });

    // Validation
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required' });
    }

    // Find user by email and role
    const user = await executeQuery('SELECT * FROM users WHERE email = ? AND role = ?', [email, role]);

    if (user.length === 0) {
      console.log('❌ [LOGIN] User not found:', { email, role });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const userData = user[0];
    console.log('✅ [LOGIN] User found:', { id: userData.id, email: userData.email, role: userData.role });

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      console.log('❌ [LOGIN] Invalid password');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check user status
    if (userData.status !== 'active') {
      console.log('❌ [LOGIN] User account not active');
      return res.status(403).json({ message: 'User account is not active' });
    }

    // For doctors, ensure doctor record exists
    if (role === 'doctor') {
      const doctorCheck = await executeQuery('SELECT id FROM doctors WHERE user_id = ?', [userData.id]);
      console.log('👨‍⚕️ [LOGIN] Doctor record check:', doctorCheck.length > 0 ? 'EXISTS' : 'MISSING');
      
      if (doctorCheck.length === 0) {
        console.log('⚠️ [LOGIN] Creating missing doctor record for user_id:', userData.id);
        // Auto-create doctor record with default values
        await executeQuery(
          'INSERT INTO doctors (user_id, specialization, license_number, experience_years, consultation_fee) VALUES (?, ?, ?, ?, ?)',
          [userData.id, 'General Physician', `LIC-${userData.id}-${Date.now()}`, 0, 50.00]
        );
        console.log('✅ [LOGIN] Doctor record created');
      }
    }

    // For patients, ensure patient record exists
    if (role === 'patient') {
      const patientCheck = await executeQuery('SELECT id FROM patients WHERE user_id = ?', [userData.id]);
      console.log('👤 [LOGIN] Patient record check:', patientCheck.length > 0 ? 'EXISTS' : 'MISSING');
      
      if (patientCheck.length === 0) {
        console.log('⚠️ [LOGIN] Creating missing patient record for user_id:', userData.id);
        await executeQuery('INSERT INTO patients (user_id) VALUES (?)', [userData.id]);
        console.log('✅ [LOGIN] Patient record created');
      }
    }

    // Generate token
    const token = jwt.sign(
      { id: userData.id, email: userData.email, role: userData.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ [LOGIN] Login successful for:', userData.email);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone,
        theme: userData.theme_preference || 'light'
      }
    });
  } catch (error) {
    console.error('❌ [LOGIN] Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Logout User
export const logout = (req, res) => {
  try {
    // JWT logout is typically handled on the frontend by removing the token
    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Logout failed', error: error.message });
  }
};

// Change Password
export const changePassword = async (req, res) => {
  try {
    const { id } = req.user;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Get user
    const user = await executeQuery('SELECT password FROM users WHERE id = ?', [id]);
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user[0].password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await executeQuery('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
