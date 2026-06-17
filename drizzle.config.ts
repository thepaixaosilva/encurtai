import { defineConfig } from "drizzle-kit"

export default defineConfig({
  out: './lib/db/migrations',
  schema: './lib/db/schemas',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DB_FILE_NAME!,
  },
});
