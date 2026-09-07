import Link from 'next/link';
import { PhoneCall, ShieldCheck, MapPin, Sparkles, ExternalLink } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-20 border-t border-white/10 bg-black/60 backdrop-blur-2xl text-foreground">
      {/* Emergency Hotline Banner */}
      <div className="border-b border-white/10 bg-gradient-to-r from-red-950/40 via-amber-950/30 to-black px-4 py-3">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-300">
            <ShieldCheck className="h-4 w-4 text-amber-400" />
            <span className="font-semibold uppercase tracking-wider">Carnival Emergency Assistance:</span>
            <span className="text-white/80">Dial 112 or Calabar Central Command:</span>
            <a
              href="tel:112"
              className="inline-flex items-center gap-1 font-bold text-amber-300 hover:text-white transition"
            >
              <PhoneCall className="h-3 w-3" /> 112 (Toll Free)
            </a>
          </div>
          <Link
            href="/safety"
            className="inline-flex items-center gap-1 font-medium text-cx-gold hover:text-cx-pink transition"
          >
            Access Full Safety Hub <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4 lg:gap-12">
          {/* Brand & Mission */}
          <div className="space-y-4 sm:col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-3xl" aria-hidden="true">🎭</span>
              <div>
                <span className="text-base font-bold tracking-tight text-white">CarnivalXperience</span>
                <span className="block text-[10px] font-semibold uppercase tracking-widest text-cx-gold">
                  Calabar, Nigeria
                </span>
              </div>
            </Link>
            <p className="text-xs text-cx-muted leading-relaxed max-w-sm">
              Your official digital companion for Africa&apos;s Biggest Street Party. Built to help visitors discover parades, book verified stays, navigate safely, and immerse in the rich culture of Cross River State.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-cx-muted">
              <MapPin className="h-3.5 w-3.5 text-cx-gold" />
              <span>Calabar Metropolis & U.J. Esuene Stadium</span>
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">Explore Carnival</h3>
            <ul className="space-y-2 text-xs text-cx-muted">
              <li>
                <Link href="/events" className="hover:text-white transition-colors">
                  Official Events Calendar
                </Link>
              </li>
              <li>
                <Link href="/hotels" className="hover:text-white transition-colors">
                  Hotels & Accommodations
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-white transition-colors">
                  Interactive Route & Venue Map
                </Link>
              </li>
              <li>
                <Link href="/vendors" className="hover:text-white transition-colors">
                  Food, Drinks & Local Vendors
                </Link>
              </li>
              <li>
                <Link href="/live" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Carnival Feed
                </Link>
              </li>
            </ul>
          </div>

          {/* Experience & Culture */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">Experience & Culture</h3>
            <ul className="space-y-2 text-xs text-cx-muted">
              <li>
                <Link href="/concierge" className="inline-flex items-center gap-1 hover:text-white transition-colors">
                  <Sparkles className="h-3 w-3 text-cx-gold" /> AI Concierge Assistant
                </Link>
              </li>
              <li>
                <Link href="/bands" className="hover:text-white transition-colors">
                  Carnival Bands & Voting
                </Link>
              </li>
              <li>
                <Link href="/bands/leaderboard" className="hover:text-white transition-colors">
                  Band Parade Standings
                </Link>
              </li>
              <li>
                <Link href="/culture" className="hover:text-white transition-colors">
                  Cultural Heritage & History
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  2024 Parade Photo Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety & Support */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">Safety & Help</h3>
            <ul className="space-y-2 text-xs text-cx-muted">
              <li>
                <Link href="/safety/emergency" className="hover:text-white transition-colors">
                  Emergency Hotlines & Contacts
                </Link>
              </li>
              <li>
                <Link href="/safety/family" className="hover:text-white transition-colors">
                  Family Location Sharing
                </Link>
              </li>
              <li>
                <Link href="/safety/lost-found" className="hover:text-white transition-colors">
                  Lost & Found Desk
                </Link>
              </li>
              <li>
                <Link href="/safety/reports" className="hover:text-white transition-colors">
                  Incident Reporting
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white transition-colors">
                  Carnival Profile & Saved Items
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-cx-muted md:flex-row">
          <p>© {currentYear} CarnivalXperience. Honoring the Calabar Carnival & Cross River State, Nigeria.</p>
          <div className="flex items-center gap-6">
            <Link href="/culture" className="hover:text-white transition">The People&apos;s Paradise</Link>
            <Link href="/safety" className="hover:text-white transition">Safety First</Link>
            <Link href="/concierge" className="text-cx-gold hover:text-cx-pink transition">Ask Concierge</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
