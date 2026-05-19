import { Link } from "@tanstack/react-router";
import { formatDate, formatUsd, type Match } from "@/lib/matches";

export function MatchCard({ match }: { match: Match }) {
  const cheapest = Math.min(...match.prices.map((p) => p.priceUsd));
  return (
    <Link
      to="/matches/$matchId"
      params={{ matchId: match.id }}
      className="group block overflow-hidden rounded-xl border border-border bg-card transition hover:border-primary/60 hover:ring-glow"
    >
      <div className="flex items-center justify-between border-b border-border bg-background/40 px-5 py-3 text-xs uppercase tracking-wider text-muted-foreground">
        <span>{match.stage}</span>
        <span>{match.matchNo}{match.group ? ` · ${match.group}` : ""}</span>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center">
            <div className="text-3xl">{match.homeFlag}</div>
            <div className="mt-1 font-display text-lg tracking-wide">{match.homeTeam}</div>
          </div>
          <div className="font-display text-2xl text-muted-foreground">VS</div>
          <div className="flex-1 text-center">
            <div className="text-3xl">{match.awayFlag}</div>
            <div className="mt-1 font-display text-lg tracking-wide">{match.awayTeam}</div>
          </div>
        </div>
        <div className="mt-5 space-y-1 text-sm text-muted-foreground">
          <div>{formatDate(match.date)} · {match.kickoffLocal} local</div>
          <div>{match.venue} — {match.city}, {match.country}</div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">From</div>
            <div className="font-display text-2xl text-gradient-gold">{formatUsd(cheapest)}</div>
          </div>
          <span className="rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
            Get tickets →
          </span>
        </div>
      </div>
    </Link>
  );
}
