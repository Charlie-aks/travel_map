import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load .env variables so drizzle-kit can use them
dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
  verbose: true,
  strict: true,
});
