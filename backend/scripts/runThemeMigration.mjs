import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigration() {
  let connection;
  
  try {
    console.log('🔄 Connecting to database...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'medcare_db',
      multipleStatements: true
    });

    console.log('✅ Connected to database');
    console.log('📄 Running theme preference migration...');

    const migrationPath = join(__dirname, '../migrations/add_theme_preference.sql');
    const sql = await fs.readFile(migrationPath, 'utf8');

    await connection.query(sql);

    console.log('✅ Theme preference migration completed successfully!');
    console.log('📊 Users table now has theme_preference column');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

runMigration();
