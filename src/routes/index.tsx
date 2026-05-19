import { createFileRoute, Link } from "@tanstack/react-router";
import heroStadium from "@/assets/hero-stadium.jpg";
import trophy from "@/assets/trophy.jpg";
import { matches } from "@/lib/matches";
import { MatchCard } from "@/components/MatchCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "World Cup Tix — Tickets for FIFA World Cup 26™" },
      { name: "description", content: "All 104 matches. Real FIFA categories. Pay with Bitcoin. The fan-first way to get to the World Cup." },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = matches.filter((m) => m.featured);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroStadium}
          alt="World Cup stadium at sunset"
          width={1920}
          height={1080}
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/40 via-background/70 to-background" />

        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 md:py-40">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              On sale now · Visa presale
            </span>
            <h1 className="mt-6 font-display text-5xl leading-none tracking-wider sm:text-7xl md:text-8xl">
              THE WORLD'S<br />
              <span className="text-gradient-gold">GREATEST STAGE</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              FIFA World Cup 26™ — 104 matches across the USA, Canada and Mexico.
              Browse the schedule, pick your seats, and check out with Bitcoin.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/matches"
                className="inline-flex items-center gap-2 rounded-md gradient-gold px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Browse all matches
                <span aria-hidden>→</span>
              </Link>
              <a href="#featured" className="inline-flex items-center gap-2 rounded-md border border-border bg-card/60 px-6 py-3 font-semibold backdrop-blur transition hover:border-primary/60">
                See featured fixtures
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-border bg-card/40">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4">
          {[
            { k: "104", v: "Matches" },
            { k: "48", v: "Nations" },
            { k: "16", v: "Host cities" },
            { k: "$60+", v: "Starting price" },
          ].map((s) => (
            <div key={s.v} className="text-center">
              <div className="font-display text-4xl text-gradient-gold">{s.k}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section id="featured" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-4xl tracking-wider">FEATURED FIXTURES</h2>
            <p className="mt-2 text-muted-foreground">Hand-picked headline matches across the tournament.</p>
          </div>
          <Link to="/matches" className="hidden text-sm font-semibold text-primary hover:underline sm:block">
            View all 104 →
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      </section>

      {/* Trophy band */}
      <section className="relative overflow-hidden border-t border-border">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 md:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl tracking-wider md:text-5xl">
              YOUR SEAT TO<br />
              <span className="text-gradient-gold">HISTORY</span>
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              From the opening match at Estadio Azteca to the Final at MetLife
              Stadium — secure your place in the stands. Every category, every
              host city, one checkout.
            </p>
            <Link
              to="/matches"
              className="mt-6 inline-flex rounded-md gradient-gold px-6 py-3 font-semibold text-primary-foreground"
            >
              Find your match
            </Link>
          </div>
          <div className="relative">
            <img
              src={trophy}
              alt="FIFA World Cup trophy"
              width={1024}
              height={1024}
              loading="lazy"
              className="mx-auto h-80 w-80 rounded-2xl object-cover ring-glow md:h-96 md:w-96"
            />
          </div>
        </div>
      </section>
    </>
  );
}
