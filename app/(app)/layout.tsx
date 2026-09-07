'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AuthProvider } from '@/components/providers/auth-provider';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Footer } from '@/components/navigation/footer';

const navItems = [
	{ href: '/events', label: 'Events' },
	{ href: '/hotels', label: 'Hotels' },
	{ href: '/bands', label: 'Bands' },
	{ href: '/map', label: 'Map' },
	{ href: '/culture', label: 'Culture' },
	{ href: '/concierge', label: 'Concierge' },
	{ href: '/safety', label: 'Safety' },
];

const mobileNavItems = [
	{ href: '/events', label: 'Events' },
	{ href: '/hotels', label: 'Hotels' },
	{ href: '/bands', label: 'Bands' },
	{ href: '/map', label: 'Map' },
	{ href: '/concierge', label: 'AI Chat' },
	{ href: '/safety', label: 'Safety' },
];

export default function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const shouldReduceMotion = useReducedMotion();

	const pageTransition = shouldReduceMotion
		? {
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			exit: { opacity: 0 },
			transition: { duration: 0.15, ease: 'easeOut' },
		}
		: {
			initial: { opacity: 0, y: 8 },
			animate: { opacity: 1, y: 0 },
			exit: { opacity: 0, y: -8 },
			transition: { duration: 0.25, ease: 'easeOut' },
		};

	return (
		<AuthProvider>
			<div className="min-h-screen bg-gradient-to-b from-cx-deep via-cx-night to-background text-foreground flex flex-col">
				<header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur-xl">
					<div className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
						<Link href="/" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cx-gold rounded-lg p-1">
							<span className="text-2xl" aria-hidden="true">
								🎭
							</span>
							<span className="text-sm font-semibold uppercase tracking-[0.14em] text-cx-muted md:text-xs">
								CarnivalXperience
							</span>
						</Link>
						<nav className="hidden items-center gap-1 text-xs font-medium md:flex" aria-label="Main Navigation">
							{navItems.map((item) => {
								const active = pathname.startsWith(item.href);
								return (
									<Link
										key={item.href}
										href={item.href}
										className={`relative inline-flex items-center rounded-full px-3 py-1.5 text-xs transition-[transform,color,background-color] duration-140 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
											active
												? 'bg-white/[0.12] text-white font-semibold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]'
												: 'text-white/60 hover:text-white hover:bg-white/[0.05]'
										}`}
									>
										<span>{item.label}</span>
									</Link>
								);
							})}
						</nav>
						<div className="flex items-center gap-2">
							<Link
								href="/"
								className="hidden rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-white/80 transition-[transform,background-color] duration-140 ease-out hover:bg-white/10 hover:text-white active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 md:inline-flex"
								aria-label="Return to homepage"
							>
								Home
							</Link>
							<ThemeToggle />
							<Link
								href="/profile"
								className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] text-xs font-semibold text-white transition-[transform,background-color] duration-140 ease-out hover:bg-white/15 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
								aria-label="Open profile"
							>
								ME
							</Link>
						</div>
					</div>
				</header>

				{/* Mobile bottom nav with accessible 48px touch targets */}
				<nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/90 px-2 py-1 backdrop-blur-xl md:hidden" aria-label="Mobile Navigation">
					<ul className="flex items-center justify-around text-[11px] font-medium text-white/60">
						{mobileNavItems.map((item) => {
							const active = pathname.startsWith(item.href);
							return (
								<li key={item.href} className="flex-1">
									<Link
										href={item.href}
										className="flex flex-col items-center justify-center min-h-[48px] gap-1 rounded-xl px-1 py-1 transition-[transform,color] duration-140 ease-out active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
									>
										<span
											className={
												active
													? 'h-1 w-4 rounded-full bg-amber-400'
													: 'h-1 w-4 rounded-full bg-transparent'
											}
											aria-hidden="true"
										/>
										<span className={active ? 'text-white font-semibold' : 'text-white/60'}>{item.label}</span>
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>

				<div className="flex-1 pb-20 md:pb-0">
					<AnimatePresence mode="wait">
						<motion.main
							id="main-content"
							key={pathname}
							className="container mx-auto px-4 py-6"
							initial={pageTransition.initial}
							animate={pageTransition.animate}
							exit={pageTransition.exit}
							transition={pageTransition.transition}
						>
							{children}
						</motion.main>
					</AnimatePresence>
				</div>

				<Footer />
			</div>
		</AuthProvider>
	);
}

