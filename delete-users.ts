import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { db } from './src/db/index.js';
import { users, accounts } from './src/db/schema.js';

async function main() {
  console.log("Deleting all users to resolve conflict...");
  try {
    await db.delete(accounts);
    await db.delete(users);
    console.log("Users and accounts deleted successfully!");
  } catch(e) {
    console.error("Error:", e);
  }
  process.exit();
}

main();
