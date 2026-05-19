import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import matchAction from "@/assets/match-action.jpg";
import { formatDate, formatUsd, getMatch, type Category } from "@/lib/matches";
import { readCart, setCart } from "@/lib/cart";

import type { Match } from "@/lib/matches";

export const Route = createFileRoute("/matches/$matchId")({
  loader: ({ params }): { match: Match } => {
    const match = getMatch(params.matchId);
    if (!match) throw notFound();
    return { match };
  },
  head: ({ loaderData }) => {
    const m = loaderData?.match;
    if (!m) return { meta: [{ title: "Match — World Cup Tix" }] };
    const title = `${m.homeTeam} vs ${m.awayTeam} — ${m.stage} | World Cup Tix`;
    return {
      meta: [
        { title },
        { name: "description", content: `${m.stage} · ${formatDate(m.date)} · ${m.venue}, ${m.city}. Tickets from ${formatUsd(Math.min(...m.prices.map(p => p.priceUsd)))}.` },
        { property: "og:title", content: title },
      ],
    };
  },
  component: MatchDetail,
});

function MatchDetail() {
  const { match } = Route.useLoaderData();
  const navigate = useNavigate();
  const [quantities, setQuantities] = useState<Record<Category, number>>({
    Cat1: 0, Cat2: 0, Cat3: 0, Cat4: 0,
  });

  const subtotal = useMemo(
    () => match.prices.reduce((s, p) => s + p.priceUsd * (quantities[p.category] || 0), 0),
    [quantities, match.prices]
  );
  const totalTickets = Object.values(quantities).reduce((a, b) => a + b, 0);

  const setQty = (cat: Category, delta: number) =>
    setQuantities((q) => ({ ...q, [cat]: Math.max(0, Math.min(8, (q[cat] || 0) + delta)) }));

  const handleAddToCart = (goToCheckout: boolean) => {
    if (totalTickets === 0) return;
    const existing = readCart().filter((i) => i.matchId !== match.id);
    const additions = match.prices
      .filter((p) => quantities[p.category] > 0)
      .map((p) => ({
        matchId: match.id,
        category: p.category,
        quantity: quantities[p.category],
        unitPriceUsd: p.priceUsd,
      }));
    setCart([...existing, ...additions]);
    if (goToCheckout) navigate({ to: "/checkout" });
    else setQuantities({ Cat1: 0, Cat2: 0, Cat3: 0, Cat4: 0 });
  };

  return (
    <article className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="text-sm text-muted-foreground">
        <Link to="/matches" className="hover:text-foreground">All matches</Link> · {match.stage}
      </div>

      {/* Hero card */}
      <div className="relative mt-4 overflow-hidden rounded-2xl border border-border">
        <img
          src={matchAction}
          alt=""
          width={1280}
          height={720}
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-card/40 to-card" />
        <div className="p-8 sm:p-12">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
            <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-primary">{match.stage}</span>
            <span>{match.matchNo}</span>
            {match.group && <span>{match.group}</span>}
          </div>

          <div className="mt-8 grid grid-cols-1 items-center gap-6 sm:grid-cols-[1fr_auto_1fr]">
            <div className="text-center sm:text-right">
              <div className="text-6xl">{match.homeFlag}</div>
              <div className="mt-3 font-display text-4xl tracking-wider sm:text-5xl">{match.homeTeam}</div>
            </div>
            <div className="font-display text-3xl text-muted-foreground">VS</div>
            <div className="text-center sm:text-left">
              <div className="text-6xl">{match.awayFlag}</div>
              <div className="mt-3 font-display text-4xl tracking-wider sm:text-5xl">{match.awayTeam}</div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 border-t border-border pt-6 sm:grid-cols-3">
            <Info label="Date" value={formatDate(match.date)} />
            <Info label="Kick-off" value={`${match.kickoffLocal} local time`} />
            <Info label="Venue" value={`${match.venue} — ${match.city}, ${match.country}`} />
          </div>
        </div>
      </div>

      {/* Ticket selector */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <section>
          <h2 className="font-display text-2xl tracking-wider">SELECT YOUR SEATS</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Prices shown are FIFA-published starting prices per category, in USD.
          </p>
          <div className="mt-5 space-y-3">
            {match.prices.map((p) => (
              <div
                key={p.category}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="grid h-12 w-12 place-items-center rounded-md text-sm font-bold"
                    style={{
                      background: p.category === "Cat1" ? "var(--color-gold)"
                                : p.category === "Cat2" ? "color-mix(in oklab, var(--color-gold) 70%, var(--color-background))"
                                : p.category === "Cat3" ? "color-mix(in oklab, var(--color-gold) 40%, var(--color-background))"
                                : "var(--color-muted)",
                      color: "var(--color-primary-foreground)",
                    }}
                  >
                    {p.category.replace("Cat", "C")}
                  </div>
                  <div>
                    <div className="font-semibold">{p.label}</div>
                    <div className="text-xs text-muted-foreground">{p.description}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 sm:gap-6">
                  <div className="text-right">
                    <div className="font-display text-xl">{formatUsd(p.priceUsd)}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">per ticket</div>
                  </div>
                  <div className="flex items-center gap-2 rounded-md border border-border">
                    <button
                      type="button"
                      onClick={() => setQty(p.category, -1)}
                      className="h-9 w-9 text-lg disabled:opacity-30"
                      disabled={quantities[p.category] === 0}
                      aria-label="Decrease"
                    >−</button>
                    <span className="w-6 text-center font-semibold tabular-nums">
                      {quantities[p.category]}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(p.category, +1)}
                      className="h-9 w-9 text-lg disabled:opacity-30"
                      disabled={quantities[p.category] >= 8}
                      aria-label="Increase"
                    >+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Summary */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display text-xl tracking-wider">ORDER SUMMARY</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Tickets</dt>
                <dd>{totalTickets}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3">
                <dt className="font-semibold">Subtotal</dt>
                <dd className="font-display text-2xl text-gradient-gold">{formatUsd(subtotal)}</dd>
              </div>
            </dl>
            <button
              type="button"
              disabled={totalTickets === 0}
              onClick={() => handleAddToCart(true)}
              className="mt-5 inline-flex w-full items-center justify-center rounded-md gradient-gold px-4 py-3 font-semibold text-primary-foreground transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              {totalTickets === 0 ? "Select seats to continue" : "Checkout with BTC →"}
            </button>
            <button
              type="button"
              disabled={totalTickets === 0}
              onClick={() => handleAddToCart(false)}
              className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-border px-4 py-2 text-sm transition disabled:opacity-40 hover:border-primary"
            >
              Add to cart
            </button>
            <p className="mt-4 text-xs text-muted-foreground">
              Service fees calculated at checkout. Tickets delivered as mobile
              barcodes 48h before kick-off.
            </p>
          </div>
        </aside>
      </div>
    </article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}
