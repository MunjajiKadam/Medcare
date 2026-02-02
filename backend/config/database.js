import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'manju123',
  database: process.env.DB_NAME || 'medcare_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  decimalNumbers: true,
  namedPlaceholders: true,
});

// Get connection for queries
export const getConnection = async () => {
  try {
    return await pool.getConnection();
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

// Execute query
export const executeQuery = async (query, values = []) => {
  const connection = await getConnection();
  try {
    const [results] = await connection.execute(query, values);
    return results;
  } catch (error) {
    console.error('Query execution error:', error);
    throw error;
  } finally {
    await connection.release();
  }
};

export default pool;
