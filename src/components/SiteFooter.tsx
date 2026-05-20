export function SiteFooter() {
  return (
    <footer id="about" className="mt-20 border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="font-display text-2xl tracking-wider">
            WORLD CUP <span className="text-gradient-gold">TIX</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Official ticketing platform for FIFA World Cup 26™.
            Secure your seats for the world's greatest sporting event.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Tournament Info</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>104 matches across 3 countries</li>
            <li>June 11 - July 19, 2026</li>
            <li>Secure Bitcoin payments accepted</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Customer Support</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>24/7 Support available</li>
            <li>Mobile ticket delivery</li>
            <li>Secure payment processing</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} FIFA World Cup 26™ Official Ticketing Platform
      </div>
      </div>
    </footer>
  );
}
