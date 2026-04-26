import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  console.log("Connecting to Database:", process.env.DATABASE_URL?.slice(0, 25) + '...');
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    
    // Xoá tất cả users để reset (hoặc có thể tuỳ chỉnh xoá 1 email)
    // Lưu ý: Cần xoá các khoá ngoại trước
    console.log("Clearing reviews...");
    await client.query('DELETE FROM "review"');
    console.log("Clearing saved_locations...");
    await client.query('DELETE FROM "saved_location"');
    console.log("Clearing locations...");
    await client.query('DELETE FROM "location"');
    console.log("Clearing accounts...");
    await client.query('DELETE FROM "account"');
    console.log("Clearing users...");
    await client.query('DELETE FROM "user"');
    
    console.log("Database reset thành công. Tất cả accounts và users đã bị xoá.");
  } catch(e) {
    console.error("Lỗi:", e);
  } finally {
    await client.end();
  }
}
main();
