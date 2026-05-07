import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mx-auto px-4">
        <div>
          <p className="text-sm font-semibold">Technodemocracy</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            From magical internet money to magical internet votes.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <a href="https://interneta.world" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            ↗ interneta.world (the network state)
          </a>
          <Link href="/feed" className="hover:text-foreground transition-colors">Live feed</Link>
          <Link href="/parties/new" className="hover:text-foreground transition-colors">Start a party</Link>
          <span>Built on Base · All votes verifiable onchain</span>
        </div>
      </div>
      <div className="text-center text-xs text-muted-foreground py-3 border-t mt-4">
        Built by <a href="https://adampang.com" className="underline hover:text-foreground">Adam Pangelinan</a>
        {' · '}<a href="https://sellsniper.com" className="underline hover:text-foreground">More projects</a>
      </div>
    </footer>
  );
}
