export function SiteFooter() {
  return (
    <footer id="about" className="mt-20 border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="font-display text-2xl tracking-wider">
            WORLD CUP <span className="text-gradient-gold">TIX</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Official-style storefront for FIFA World Cup 26™ tickets.
            Pricing shown matches FIFA's published starting prices by category.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">About</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Browse 104 World Cup matches</li>
            <li>Select category & quantity</li>
            <li>Pay with Bitcoin (BTC)</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Disclaimer</h4>
          <p className="mt-3 text-sm text-muted-foreground">
            Not affiliated with FIFA. No real payments are processed. This is a
            functional prototype built to showcase a ticketing flow.
          </p>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} World Cup Tix
      </div>
    </footer>
  );
}
