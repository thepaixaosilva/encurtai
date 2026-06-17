import { NextResponse } from "next/server";
import { retrieveLongUrl } from "@/lib/db/actions";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ shortcode: string }> }
) {
  const { shortcode } = await params;

  const longUrl = await retrieveLongUrl(shortcode);

  if (!longUrl) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.redirect(longUrl);
}
