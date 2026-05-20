import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { matches, formatUsd, type Match } from "@/lib/matches";
import { readCart, setCart, clearCart, BTC_USD, usdToBtc, formatBtc, type CartItem } from "@/lib/cart";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — FIFA World Cup 26™ Official Ticketing" },
      { name: "description", content: "Complete your FIFA World Cup 2026 ticket purchase. Secure Bitcoin payment processing." },
    ],
  }),
  component: CheckoutPage,
});

const SERVICE_FEE_RATE = 0.12; // 12% service fee, like Ticketmaster-style
const DELIVERY_FEE = 4.5;

const MERCHANT_BTC_ADDRESS = "bc1qxnvqnsq9espec2ahsnkzdl3jqxtgsdveu6rzqv";

const checkoutSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  fullName: z.string().trim().min(2, "Enter your full name").max(120),
});

function CheckoutPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setItems(readCart());
  }, []);

  const enriched = useMemo(() => {
    return items
      .map((i) => {
        const m = matches.find((mm) => mm.id === i.matchId);
        return m ? { ...i, match: m } : null;
      })
      .filter((x): x is CartItem & { match: Match } => x !== null);
  }, [items]);

  const subtotal = enriched.reduce((s, i) => s + i.unitPriceUsd * i.quantity, 0);
  const fee = subtotal * SERVICE_FEE_RATE;
  const delivery = enriched.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + fee + delivery;
  const btcTotal = usdToBtc(total);

  const updateQty = (idx: number, delta: number) => {
    const next = [...items];
    const newQty = Math.max(0, next[idx].quantity + delta);
    if (newQty === 0) next.splice(idx, 1);
    else next[idx] = { ...next[idx], quantity: newQty };
    setItems(next);
    setCart(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enriched.length === 0) return;
    const parsed = checkoutSchema.safeParse({ email, fullName });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errs[issue.path[0] as string] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);

    const orderId = "WCT-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    sessionStorage.setItem("wctix_last_order", JSON.stringify({
      orderId,
      email: parsed.data.email,
      fullName: parsed.data.fullName,
      merchantBtcAddress: MERCHANT_BTC_ADDRESS,
      items: enriched.map((i) => ({
        matchId: i.matchId,
        homeTeam: i.match.homeTeam,
        awayTeam: i.match.awayTeam,
        stage: i.match.stage,
        venue: i.match.venue,
        date: i.match.date,
        category: i.category,
        quantity: i.quantity,
        unitPriceUsd: i.unitPriceUsd,
      })),
      subtotal, fee, delivery, total, btcTotal,
      placedAt: new Date().toISOString(),
    }));

    setTimeout(() => {
      clearCart();
      navigate({ to: "/confirmation" });
    }, 700);
  };

  if (enriched.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-4xl tracking-wider">YOUR CART IS EMPTY</h1>
        <p className="mt-3 text-muted-foreground">Pick a match to add tickets to your cart.</p>
        <Link to="/matches" className="mt-6 inline-flex rounded-md gradient-gold px-6 py-3 font-semibold text-primary-foreground">
          Browse matches
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl tracking-wider">CHECKOUT</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Left: cart + form */}
        <div className="space-y-8">
          <section className="rounded-xl border border-border bg-card">
            <header className="border-b border-border px-5 py-3 font-display text-lg tracking-wider">YOUR TICKETS</header>
            <ul className="divide-y divide-border">
              {enriched.map((item, idx) => (
                <li key={`${item.matchId}-${item.category}`} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-semibold">
                      {item.match.homeFlag} {item.match.homeTeam} <span className="text-muted-foreground">vs</span> {item.match.awayTeam} {item.match.awayFlag}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {item.match.stage} · {item.match.venue}, {item.match.city} · Category {item.category.replace("Cat", "")}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:gap-6">
                    <div className="flex items-center gap-2 rounded-md border border-border">
                      <button type="button" onClick={() => updateQty(idx, -1)} className="h-9 w-9">−</button>
                      <span className="w-6 text-center tabular-nums">{item.quantity}</span>
                      <button type="button" onClick={() => updateQty(idx, +1)} className="h-9 w-9">+</button>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-lg">{formatUsd(item.unitPriceUsd * item.quantity)}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {formatUsd(item.unitPriceUsd)} ea.
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card" noValidate>
            <header className="border-b border-border px-5 py-3 font-display text-lg tracking-wider">BUYER DETAILS</header>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <Field label="Full name" error={errors.fullName}>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  maxLength={120}
                  required
                  className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                />
              </Field>
              <Field label="Email (for ticket delivery)" error={errors.email}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={255}
                  required
                  className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                />
              </Field>
            </div>

            <header className="border-y border-border bg-background/40 px-5 py-3 font-display text-lg tracking-wider">
              <span className="text-gradient-gold">₿</span> PAY WITH BITCOIN
            </header>
            <div className="space-y-4 p-5">
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">Amount due</div>
                    <div className="text-xs text-muted-foreground">
                      Rate: 1 BTC = {formatUsd(BTC_USD)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl text-gradient-gold">{formatBtc(btcTotal)}</div>
                    <div className="text-xs text-muted-foreground">≈ {formatUsd(total)}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Send payment to this address
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 break-all rounded bg-background px-3 py-2 font-mono text-sm">
                    {MERCHANT_BTC_ADDRESS}
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(MERCHANT_BTC_ADDRESS);
                    }}
                    className="rounded-md border border-border px-3 py-2 text-xs hover:bg-background"
                    title="Copy address"
                  >
                    Copy
                  </button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Transfer exactly <strong className="text-foreground">{formatBtc(btcTotal)}</strong> to the address above.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md gradient-gold px-4 py-3 font-semibold text-primary-foreground transition disabled:opacity-60"
              >
                {submitting ? "Processing order…" : `Confirm order — ${formatBtc(btcTotal)}`}
              </button>
              <p className="text-xs text-muted-foreground">
                Click confirm to proceed to your order confirmation.
              </p>
            </div>
          </form>
        </div>

        {/* Right: totals */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display text-xl tracking-wider">ORDER TOTAL</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <Row label="Subtotal" value={formatUsd(subtotal)} />
              <Row label={`Service fee (${Math.round(SERVICE_FEE_RATE * 100)}%)`} value={formatUsd(fee)} />
              <Row label="Mobile delivery" value={formatUsd(delivery)} />
              <div className="my-3 border-t border-border" />
              <div className="flex items-baseline justify-between">
                <dt className="font-semibold">Total (USD)</dt>
                <dd className="font-display text-2xl">{formatUsd(total)}</dd>
              </div>
              <div className="flex items-baseline justify-between">
                <dt className="font-semibold text-primary">Total (BTC)</dt>
                <dd className="font-display text-xl text-gradient-gold">{formatBtc(btcTotal)}</dd>
              </div>
            </dl>
          </div>
          <Link to="/matches" className="mt-3 block text-center text-sm text-muted-foreground hover:text-foreground">
            ← Keep browsing matches
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label, error, hint, children,
}: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
