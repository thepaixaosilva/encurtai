import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const urls = sqliteTable('urls', {
  id: int('id').primaryKey({ autoIncrement: true }),

  longUrl: text('long_url').notNull(),

  createdAt: int('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});
