import Link from 'next/link';
import { Compass, Calendar, Sparkles, Home, ShieldAlert } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-gradient-to-b from-cx-deep via-cx-night to-black px-6 py-16 text-center text-foreground">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-tr from-cx-gold/20 via-cx-flame/15 to-cx-pink/20 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-lg space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-cx-gold/30 bg-cx-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cx-gold shadow-sm">
          <span className="text-base" aria-hidden="true">🎭</span> Error 404
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Lost on the <span className="bg-gradient-to-r from-cx-gold via-cx-flame to-cx-pink bg-clip-text text-transparent">Carnival Route?</span>
        </h1>

        <p className="text-sm text-cx-muted sm:text-base leading-relaxed">
          The page you are looking for has danced ahead or taken a detour off Mary Slessor Avenue. Don&apos;t worry – your carnival adventure is just a tap away.
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cx-gold via-cx-flame to-cx-pink px-6 py-3 text-sm font-semibold text-cx-deep shadow-xl transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cx-gold"
          >
            <Home className="h-4 w-4" /> Return Home
          </Link>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cx-pink"
          >
            <Calendar className="h-4 w-4 text-cx-gold" /> Browse Events
          </Link>
        </div>

        {/* Quick routes */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl text-xs text-cx-muted">
          <p className="font-semibold uppercase tracking-wider text-white/80 mb-3">Or jump directly to:</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <Link
              href="/map"
              className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/5 p-2.5 hover:border-cx-gold/40 hover:text-white transition"
            >
              <Compass className="h-3.5 w-3.5 text-cx-gold" />
              <span>Parade Map</span>
            </Link>
            <Link
              href="/concierge"
              className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/5 p-2.5 hover:border-cx-gold/40 hover:text-white transition"
            >
              <Sparkles className="h-3.5 w-3.5 text-cx-pink" />
              <span>AI Concierge</span>
            </Link>
            <Link
              href="/safety"
              className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/5 p-2.5 hover:border-cx-gold/40 hover:text-white transition"
            >
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
              <span>Safety Desk</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
