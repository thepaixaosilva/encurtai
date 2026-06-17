"use server";

import { shortenUrl } from "@/lib/db/actions";
import { headers } from "next/headers";

export type ShortenResult =
  | { ok: true; shortUrl: string }
  | { ok: false; error: string };

export async function shortenUrlAction(
  _prev: ShortenResult | null,
  formData: FormData
): Promise<ShortenResult> {
  const raw = formData.get("url");

  if (typeof raw !== "string" || raw.trim() === "") {
    return { ok: false, error: "Enter a URL." };
  }

  const trimmed = raw.trim();

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { ok: false, error: "Invalid URL. Make sure it starts with https://." };
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return { ok: false, error: "Only http and https URLs are allowed." };
  }

  try {
    const shortcode = await shortenUrl(trimmed);

    const headersList = await headers();
    const host = headersList.get("host") ?? "localhost:3000";
    const protocol = host.startsWith("localhost") ? "http" : "https";
    const shortUrl = `${protocol}://${host}/${shortcode}`;

    return { ok: true, shortUrl };
  } catch {
    return { ok: false, error: "Something went wrong. Try again." };
  }
}
