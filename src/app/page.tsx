
"use client";

import { useEffect, useMemo, useState } from "react";
import { predictions } from "@/lib/predictions";

type Match = {
  id: number;
  utcDate: string;
  status: string;
  homeTeam: { name: string; crest?: string | null };
  awayTeam: { name: string; crest?: string | null };
  competition?: { name?: string };
  score?: {
    fullTime?: { home: number | null; away: number | null };
  };
  source?: string;
};

const filters = [
  "All markets",
  "Over 2.5",
  "BTTS",
  "1X2",
  "BTTS + Total",
  "1X2 + BTTS"
];

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [source, setSource] = useState("Loading fixtures…");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All markets");
  const [query, setQuery] = useState("");
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [adminStatus, setAdminStatus] = useState("");

  async function load() {
    setError("");

    try {
      const response = await fetch("/api/matches");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load matches");
      }

      setMatches(data.matches || []);
      setSource(data.source || "Unknown source");
      setNotice(data.notice || "");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load fixtures"
      );
      setSource("Unavailable");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const visible = useMemo(
    () =>
      matches.filter((match) =>
        (
          `${match.homeTeam.name} ${match.awayTeam.name} ${
            match.competition?.name || ""
          }`
        )
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [matches, query]
  );

  async function checkAdmin(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setAdminStatus("Checking…");

    try {
      const response = await fetch("/api/admin", {
        headers: {
          Authorization: `Bearer ${adminKey}`
        }
      });

      const data = await response.json();

      setAdminStatus(
        response.ok
          ? `Access verified. Football API configured: ${
              data.checks.footballApiConfigured ? "yes" : "no"
            }`
          : data.error || "Access denied"
      );
    } catch {
      setAdminStatus("Could not verify access.");
    }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#">
          <span className="brand-mark">TP</span>
          <span>
            TRENCH <b>PREDICTIONS</b>
          </span>
        </a>

        <div className="top-actions">
          <span className="status">
            <i /> {source}
          </span>

          <button
            className="admin-button"
            onClick={() => setAdminOpen(!adminOpen)}
          >
            Admin access
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="eyebrow">
          <i /> FOOTBALL INTELLIGENCE · MATCHDAY
        </div>

        <h1>
          Read the game.
          <br />
          <em>Know the numbers.</em>
        </h1>

        <p>
          Probability-led match insights for goals, both teams
          to score and match outcomes.
        </p>

        <div className="hero-stats">
          <div>
            <strong>{String(matches.length).padStart(2, "0")}</strong>
            <span>FIXTURES LOADED</span>
          </div>
          <div>
            <strong>05</strong>
            <span>CORE MARKETS</span>
          </div>
          <div>
            <strong>24/7</strong>
            <span>INSIGHT ACCESS</span>
          </div>
        </div>
      </section>

      {adminOpen && (
        <section className="admin-panel">
          <h2>Admin access check</h2>
          <p>
            Enter the server-side ADMIN_SECRET. This starter
            only verifies the secret; full user management and
            prediction editing require database-backed
            authentication.
          </p>

          <form onSubmit={checkAdmin}>
            <input
              type="password"
              value={adminKey}
              onChange={(event) => setAdminKey(event.target.value)}
              placeholder="Admin secret"
              required
            />
            <button className="primary" type="submit">
              Verify
            </button>
          </form>

          {adminStatus && <p role="status">{adminStatus}</p>}
        </section>
      )}

      <section className="section-head">
        <div>
          <div className="eyebrow">THE DAILY BOARD</div>
          <h2>
            Upcoming fixtures{" "}
            <span className="count">{visible.length}</span>
          </h2>
        </div>

        <button className="refresh" onClick={load}>
          ↻ Refresh
        </button>
      </section>

      <div className="toolbar">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search teams or competitions…"
        />

        <div className="filters">
          {filters.map((item) => (
            <button
              key={item}
              className={
                filter === item ? "filter active" : "filter"
              }
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {notice && <div className="notice">{notice}</div>}
      {error && <div className="error">{error}</div>}

      <section className="fixtures">
        {visible.map((match) => {
          const outcomes = predictions();
          const relevant =
            filter === "All markets"
              ? outcomes
              : outcomes.filter((outcome) => outcome.market === filter);

          return (
            <article className="match-card" key={match.id}>
              <div className="match-meta">
                <span>
                  {match.competition?.name || "Football"} ·{" "}
                  {match.status.replaceAll("_", " ")}
                </span>
                <span>
                  {new Date(match.utcDate).toLocaleString([], {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>

              <div className="teams">
                <div className="team">
                  <span className="crest">
                    {match.homeTeam.name.slice(0, 1)}
                  </span>
                  <b>{match.homeTeam.name}</b>
                </div>

                <span className="vs">VS</span>

                <div className="team away">
                  <span className="crest">
                    {match.awayTeam.name.slice(0, 1)}
                  </span>
                  <b>{match.awayTeam.name}</b>
                </div>
              </div>

              <div className="market-title">
                <span>MODEL PROBABILITIES</span>
                <span>Baseline model</span>
              </div>

              <div className="outcomes">
                {relevant.map((outcome) => (
                  <div className="outcome" key={outcome.label}>
                    <span>{outcome.label}</span>
                    <strong>
                      {outcome.probability.toFixed(1)}%
                    </strong>
                    <div className="bar">
                      <i
                        style={{
                          width: `${Math.min(
                            100,
                            outcome.probability
                          )}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="disclaimer">
                Illustrative baseline probabilities, not verified
                match-specific forecasts. Team form and historical
                data are not yet incorporated.
              </p>
            </article>
          );
        })}

        {visible.length === 0 && (
          <div className="empty">
            No fixtures match your search.
          </div>
        )}
      </section>

      <footer>
        <span>
          © {new Date().getFullYear()} TRENCH PREDICTIONS
        </span>
        <span>DATA-LED INSIGHTS · NOT GUARANTEES</span>
      </footer>
    </main>
  );
}
  
