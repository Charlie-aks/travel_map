import { db } from './src/db/index.js';
import { users } from './src/db/schema.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  const allUsers = await db.select().from(users);
  console.log("Users in DB:", allUsers.map(u => u.email));
  process.exit();
}
main();
