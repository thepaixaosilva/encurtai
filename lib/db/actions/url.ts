import { db } from "@/lib/db/drizzle";
import { urls } from "@/lib/db/schemas";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import Sqids from "sqids";

const sqids = new Sqids({
  minLength: 6,
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
});

async function shortenUrl(longUrl: string) {
  const [result] = await db
    .insert(urls)
    .values({ longUrl })
    .returning({ id: urls.id });

  return sqids.encode([result.id]);
}

async function retrieveLongUrl(shortcode: string) {
  const [id] = sqids.decode(shortcode);

  if (!id) {
    return null;
  }

  const [url] = await db
    .select()
    .from(urls)
    .where(eq(urls.id, id));

  return url?.longUrl ?? null;
}

async function getRecentUrls() {
  const rows = await db
    .select()
    .from(urls)
    .orderBy(desc(urls.createdAt))
    .limit(10);

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";

  return rows.map((row) => ({
    id: row.id,
    longUrl: row.longUrl,
    shortcode: sqids.encode([row.id]),
    shortUrl: `${protocol}://${host}/${sqids.encode([row.id])}`,
    createdAt: row.createdAt,
  }));
}

export {
  sqids,
  shortenUrl,
  retrieveLongUrl,
  getRecentUrls
}
