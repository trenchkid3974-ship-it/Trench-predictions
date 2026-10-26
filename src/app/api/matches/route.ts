
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const demo = [
  {
    id: 90001,
    utcDate: new Date(Date.now() + 3600000).toISOString(),
    status: "SCHEDULED",
    homeTeam: { name: "Demo United" },
    awayTeam: { name: "City Rovers" },
    competition: { name: "Demo League" },
    source: "demo"
  },
  {
    id: 90002,
    utcDate: new Date(Date.now() + 7200000).toISOString(),
    status: "SCHEDULED",
    homeTeam: { name: "Harbour FC" },
    awayTeam: { name: "Mountain Athletic" },
    competition: { name: "Demo League" },
    source: "demo"
  },
  {
    id: 90003,
    utcDate: new Date(Date.now() + 10800000).toISOString(),
    status: "SCHEDULED",
    homeTeam: { name: "Northside FC" },
    awayTeam: { name: "Lakeside Town" },
    competition: { name: "Demo League" },
    source: "demo"
  }
];

export async function GET(req: Request) {
  const token = process.env.FOOTBALL_DATA_TOKEN;

  if (!token) {
    return NextResponse.json({
      matches: demo,
      source: "demo",
      notice:
        "Demo fixtures only. Add FOOTBALL_DATA_TOKEN in .env.local to load real fixtures."
    });
  }

  const params = new URL(req.url).searchParams;

  const from =
    params.get("dateFrom") ||
    new Date().toISOString().slice(0, 10);

  const to =
    params.get("dateTo") ||
    new Date(Date.now() + 6 * 86400000)
      .toISOString()
      .slice(0, 10);

  try {
    const response = await fetch(
      `https://api.football-data.org/v4/matches?dateFrom=${from}&dateTo=${to}`,
      {
        headers: {
          "X-Auth-Token": token
        },
        next: { revalidate: 900 }
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          matches: [],
          source: "football-data.org",
          error: `Football API returned ${response.status}; check token, coverage and rate limits.`
        },
        { status: 502 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      matches: (data.matches || []).map((m: any) => ({
        ...m,
        source: "football-data.org"
      })),
      source: "football-data.org"
    });
  } catch {
    return NextResponse.json(
      {
        matches: [],
        source: "football-data.org",
        error: "Could not reach football data provider."
      },
      { status: 502 }
    );
  }
}
  
