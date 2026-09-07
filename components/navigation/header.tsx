'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Menu, X, ShieldAlert, MapPin } from 'lucide-react';

const navItems = [
  { href: '/events', label: 'Events' },
  { href: '/hotels', label: 'Hotels' },
  { href: '/bands', label: 'Bands' },
  { href: '/map', label: 'Route Map' },
  { href: '/culture', label: 'Heritage' },
  { href: '/concierge', label: 'AI Concierge' },
  { href: '/safety', label: 'Safety Hub' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Lockup */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-lg py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          aria-label="CarnivalXperience Home"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] transition-transform duration-140 ease-out group-active:scale-[0.96]">
            <span className="text-xl" aria-hidden="true">
              🎭
            </span>
          </div>
          <div>
            <span className="block text-sm font-bold tracking-tight text-white">
              CarnivalXperience
            </span>
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-white/50">
              <MapPin className="h-2.5 w-2.5 text-amber-400" />
              <span>Calabar &bull; Dec 1–31</span>
            </div>
          </div>
        </Link>

        {/* Desktop Tactile Segmented Navigation */}
        <nav
          className="hidden items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] p-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] lg:flex"
          aria-label="Primary Navigation"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-full px-3.5 py-1.5 text-xs font-medium transition-[transform,color,background-color] duration-140 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  isActive
                    ? 'bg-white/[0.12] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] font-semibold'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/concierge"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 text-xs font-semibold text-amber-300 transition-[transform,background-color,border-color] duration-140 ease-out hover:bg-amber-400/15 hover:border-amber-400/50 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>AI Concierge</span>
          </Link>

          <Link
            href="/safety"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/70 transition-[transform,color,background-color] duration-140 ease-out hover:text-rose-400 hover:bg-white/[0.07] active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Emergency & Safety Hub"
            title="Emergency & Safety Hub"
          >
            <ShieldAlert className="h-4 w-4" />
          </Link>

          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-full bg-white px-4 py-1.5 text-xs font-bold text-black shadow-sm transition-[transform,opacity] duration-140 ease-out hover:opacity-95 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            Get Pass
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white transition-[transform,background-color] duration-140 ease-out active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 lg:hidden"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-white/[0.08] bg-black/95 px-4 py-4 backdrop-blur-2xl lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile Navigation">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-[transform,background-color] duration-140 ease-out active:scale-[0.98] ${
                    isActive
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-white/30">&rarr;</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
