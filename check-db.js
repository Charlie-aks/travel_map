import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    const users = await client.query('SELECT id, name, email FROM "user"');
    console.log("USERS IN DB:", users.rows);
    
    const accounts = await client.query('SELECT "userId", provider, "providerAccountId" FROM "account"');
    console.log("ACCOUNTS IN DB:", accounts.rows);
  } catch(e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
main();
