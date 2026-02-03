import { executeQuery } from '../config/database.js';

async function createTables() {
  try {
    console.log('📋 Creating consultation_notes table...');
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS consultation_notes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        appointment_id INT NOT NULL,
        doctor_id INT NOT NULL,
        patient_id INT NOT NULL,
        notes TEXT NOT NULL,
        vitals JSON,
        observations TEXT,
        follow_up TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
        FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ consultation_notes table created');

    console.log('📋 Creating diagnoses table...');
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS diagnoses (
        id INT PRIMARY KEY AUTO_INCREMENT,
        appointment_id INT NOT NULL,
        doctor_id INT NOT NULL,
        patient_id INT NOT NULL,
        diagnosis TEXT NOT NULL,
        icd_code VARCHAR(20),
        severity ENUM('mild', 'moderate', 'severe') DEFAULT 'mild',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
        FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ diagnoses table created');

    console.log('📋 Creating availability_history table...');
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS availability_history (
        id INT PRIMARY KEY AUTO_INCREMENT,
        doctor_id INT NOT NULL,
        status ENUM('available', 'busy', 'on_leave') NOT NULL,
        start_date DATETIME,
        end_date DATETIME,
        reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ availability_history table created');

    console.log('📋 Creating indexes...');
    try {
      await executeQuery('CREATE INDEX idx_consultation_notes_appointment ON consultation_notes(appointment_id)');
      console.log('✅ idx_consultation_notes_appointment created');
    } catch (e) {
      console.log('⚠️  idx_consultation_notes_appointment (might already exist)');
    }
    try {
      await executeQuery('CREATE INDEX idx_consultation_notes_doctor ON consultation_notes(doctor_id)');
      console.log('✅ idx_consultation_notes_doctor created');
    } catch (e) {
      console.log('⚠️  idx_consultation_notes_doctor (might already exist)');
    }
    try {
      await executeQuery('CREATE INDEX idx_diagnoses_appointment ON diagnoses(appointment_id)');
      console.log('✅ idx_diagnoses_appointment created');
    } catch (e) {
      console.log('⚠️  idx_diagnoses_appointment (might already exist)');
    }
    try {
      await executeQuery('CREATE INDEX idx_diagnoses_doctor ON diagnoses(doctor_id)');
      console.log('✅ idx_diagnoses_doctor created');
    } catch (e) {
      console.log('⚠️  idx_diagnoses_doctor (might already exist)');
    }
    try {
      await executeQuery('CREATE INDEX idx_availability_history_doctor ON availability_history(doctor_id)');
      console.log('✅ idx_availability_history_doctor created');
    } catch (e) {
      console.log('⚠️  idx_availability_history_doctor (might already exist)');
    }
    console.log('✅ All indexes processed');

    console.log('\n✅ Database tables created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTables();
