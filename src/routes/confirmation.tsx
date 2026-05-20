import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { formatUsd } from "@/lib/matches";
import { formatBtc } from "@/lib/cart";

export const Route = createFileRoute("/confirmation")({
  head: () => ({ meta: [{ title: "Order Confirmed — FIFA World Cup 26™ Official Ticketing" }] }),
  component: ConfirmationPage,
});

interface Order {
  orderId: string;
  email: string;
  fullName: string;
  merchantBtcAddress: string;
  items: Array<{
    matchId: string;
    homeTeam: string; awayTeam: string;
    stage: string; venue: string; date: string;
    category: string; quantity: number; unitPriceUsd: number;
  }>;
  subtotal: number; fee: number; delivery: number; total: number; btcTotal: number;
  placedAt: string;
}

function ConfirmationPage() {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("wctix_last_order");
    if (raw) setOrder(JSON.parse(raw));
  }, []);

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-4xl tracking-wider">NO RECENT ORDER</h1>
        <Link to="/matches" className="mt-6 inline-flex rounded-md gradient-gold px-6 py-3 font-semibold text-primary-foreground">
          Browse matches
        </Link>
      </div>
    );
  }

  const shortAddr = order.merchantBtcAddress.slice(0, 12) + "…" + order.merchantBtcAddress.slice(-8);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-primary/40 bg-primary/5 p-6 text-center ring-glow">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full gradient-gold text-2xl text-primary-foreground">
          ✓
        </div>
        <h1 className="mt-4 font-display text-4xl tracking-wider">PAYMENT RECEIVED</h1>
        <p className="mt-2 text-muted-foreground">
          Order <span className="font-mono text-foreground">{order.orderId}</span> · A receipt has been sent to{" "}
          <span className="text-foreground">{order.email}</span>
        </p>
      </div>

      <section className="mt-8 rounded-xl border border-border bg-card">
        <header className="border-b border-border px-5 py-3 font-display text-lg tracking-wider">TICKETS</header>
        <ul className="divide-y divide-border">
          {order.items.map((it, i) => (
            <li key={i} className="flex items-center justify-between p-5">
              <div>
                <div className="font-semibold">{it.homeTeam} vs {it.awayTeam}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {it.stage} · {it.venue} · {new Date(it.date).toLocaleDateString()} · Cat {it.category.replace("Cat", "")}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">× {it.quantity}</div>
                <div className="text-xs text-muted-foreground">{formatUsd(it.unitPriceUsd * it.quantity)}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-display text-lg tracking-wider">PAYMENT</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <Row label="Method" value="Bitcoin (BTC)" />
            <Row label="Send to address" value={shortAddr} mono />
            <Row label="Amount" value={formatBtc(order.btcTotal)} />
            <Row label="USD equivalent" value={formatUsd(order.total)} />
          </dl>
          <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-3">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Full payment address
            </div>
            <code className="block break-all font-mono text-xs text-foreground">
              {order.merchantBtcAddress}
            </code>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-display text-lg tracking-wider">DELIVERY</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Your mobile tickets will be released to <span className="text-foreground">{order.email}</span>{" "}
            48 hours before the first match kicks off. Use the secure barcode in
            the email to enter the stadium.
          </p>
        </div>
      </section>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="rounded-md gradient-gold px-6 py-3 font-semibold text-primary-foreground">
          Back to home
        </Link>
        <Link to="/matches" className="rounded-md border border-border px-6 py-3 font-semibold">
          Browse more matches
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={mono ? "font-mono text-xs" : ""}>{value}</dd>
    </div>
  );
}
