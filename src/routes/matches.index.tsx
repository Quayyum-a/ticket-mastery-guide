import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { matches, type Stage } from "@/lib/matches";
import { MatchCard } from "@/components/MatchCard";

export const Route = createFileRoute("/matches/")({
  head: () => ({
    meta: [
      { title: "All Matches — FIFA World Cup 26™ Official Ticketing" },
      { name: "description", content: "Browse all 104 FIFA World Cup 2026 matches. Filter by team, city, or stage. Official ticketing platform." },
    ],
  }),
  component: MatchesPage,
});

const STAGES: Stage[] = [
  "Group Stage", "Round of 32", "Round of 16",
  "Quarter-final", "Semi-final", "Third Place", "Final",
];

function MatchesPage() {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<Stage | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return matches.filter((m) => {
      if (stage !== "all" && m.stage !== stage) return false;
      if (!q) return true;
      return (
        m.homeTeam.toLowerCase().includes(q) ||
        m.awayTeam.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q) ||
        m.venue.toLowerCase().includes(q) ||
        m.country.toLowerCase().includes(q)
      );
    });
  }, [query, stage]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-5xl tracking-wider">ALL MATCHES</h1>
        <p className="text-muted-foreground">
          {filtered.length} of {matches.length} matches shown
        </p>
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teams, cities, venues…"
            className="h-11 w-full rounded-md border border-border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-primary"
          />
        </div>
        <select
          value={stage}
          onChange={(e) => setStage(e.target.value as Stage | "all")}
          className="h-11 rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-primary"
        >
          <option value="all">All stages</option>
          {STAGES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          No matches found. Try a different search.
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      )}
    </div>
  );
}
