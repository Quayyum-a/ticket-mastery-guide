import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { readCart } from "@/lib/cart";

export function SiteHeader() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const refresh = () =>
      setCount(readCart().reduce((s, i) => s + i.quantity, 0));
    refresh();
    window.addEventListener("cart:updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("cart:updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md gradient-gold text-primary-foreground font-bold">
            W
          </span>
          <span className="font-display text-xl tracking-wider">
            WORLD CUP <span className="text-gradient-gold">TIX</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link to="/" className="text-muted-foreground transition hover:text-foreground" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }}>
            Home
          </Link>
          <Link to="/matches" className="text-muted-foreground transition hover:text-foreground" activeProps={{ className: "text-foreground" }}>
            Matches
          </Link>
          <a href="#about" className="text-muted-foreground transition hover:text-foreground">
            About
          </a>
        </nav>

        <Link
          to="/checkout"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm transition hover:border-primary"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
          </svg>
          Cart
          {count > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
