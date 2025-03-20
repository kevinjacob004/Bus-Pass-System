import { execSync } from 'child_process';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const runCommand = (command) => {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { 
      stdio: 'inherit',
      shell: true 
    });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    throw error;
  }
};

const dropAllTables = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    // First disable foreign key checks
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');

    // Get all tables
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ?
    `, [process.env.DB_NAME]);

    // Drop each table forcefully
    for (const row of tables) {
      const tableName = row.TABLE_NAME;
      await connection.execute(`DROP TABLE IF EXISTS \`${tableName}\``);
      console.log(`Dropped table: ${tableName}`);
    }

    // Re-enable foreign key checks
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('All tables dropped successfully');
  } catch (error) {
    console.error('Error dropping tables:', error);
    throw error;
  } finally {
    await connection.end();
  }
};

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const resetDatabase = async () => {
  console.log('Starting database reset process...');

  try {
    // Drop all tables first
    await dropAllTables();
    
    // Wait a bit to ensure connections are closed
    await wait(1000);

    // Generate new migrations
    runCommand('npm run db:generate');
    
    // Wait before pushing
    await wait(1000);

    // Push changes to database
    runCommand('npm run db:push');

    // Wait before seeding
    await wait(1000);

    // Create a new connection for seeding
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    try {
      // Disable foreign key checks before seeding
      await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
      
      // Seed the database
      runCommand('npm run seeddb');

      // Re-enable foreign key checks after seeding
      await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
    } finally {
      await connection.end();
    }

    console.log('Database reset completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during database reset:', error);
    process.exit(1);
  }
};

resetDatabase().catch(console.error);
