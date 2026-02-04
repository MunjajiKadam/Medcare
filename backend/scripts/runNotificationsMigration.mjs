import { readFileSync } from 'fs';
import { executeQuery } from '../config/database.js';

async function runMigration() {
  try {
    console.log('📋 Running notifications migration...');
    const sql = readFileSync('migrations/add_notifications.sql', 'utf8');
    
    console.log('SQL content length:', sql.length);
    
    // Execute as a single statement since it's simple
    if (sql.trim().length > 0) {
      await executeQuery(sql.trim());
      console.log('✓ Notifications table created successfully');
    } else {
      console.log('⚠ SQL file is empty');
    }

    console.log('\n✅ Notifications migration completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

runMigration();
