
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "ADMIN_SECRET is not configured." },
      { status: 503 }
    );
  }

  const supplied = req.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "");

  if (!supplied || supplied !== secret) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    ok: true,
    checks: {
      footballApiConfigured: Boolean(
        process.env.FOOTBALL_DATA_TOKEN
      )
    }
  });
}
