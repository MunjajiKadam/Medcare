import { readFileSync } from 'fs';
import { executeQuery } from '../config/database.js';

async function runDatabase() {
  try {
    const sql = readFileSync('./database.sql', 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`Found ${statements.length} SQL statements to execute...`);

    for (let i = 0; i < statements.length; i++) {
      try {
        await executeQuery(statements[i]);
        console.log(`✓ Statement ${i + 1}/${statements.length} executed successfully`);
      } catch (err) {
        console.log(`⚠ Statement ${i + 1} (${statements[i].substring(0, 50)}...): ${err.message}`);
      }
    }

    console.log('\n✅ Database setup completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

runDatabase();
