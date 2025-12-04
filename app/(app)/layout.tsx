'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AuthProvider } from '@/components/providers/auth-provider';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const navItems = [
	{ href: '/events', label: 'Events' },
	{ href: '/hotels', label: 'Hotels' },
	{ href: '/vendors', label: 'Vendors' },
	{ href: '/map', label: 'Map' },
	{ href: '/concierge', label: 'Concierge' },
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
			<div className="min-h-screen bg-gradient-to-b from-cx-deep via-cx-night to-background text-foreground">
				<header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur-xl">
					<div className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
						<Link href="/" className="flex items-center gap-2">
							<span className="text-2xl" aria-hidden="true">
								🎭
							</span>
							<span className="text-sm font-semibold uppercase tracking-[0.14em] text-cx-muted md:text-xs">
								CarnivalXperience
							</span>
						</Link>
						<nav className="hidden items-center gap-2 text-sm font-medium md:flex">
							{navItems.map((item) => {
								const active = pathname.startsWith(item.href);
								return (
									<Link
										key={item.href}
										href={item.href}
										className="relative inline-flex items-center rounded-full px-3 py-1.5 text-xs transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cx-gold"
									>
										<span
											className={
												active
													? 'text-white'
													: 'text-cx-muted hover:text-white'
											}
										>
											{item.label}
										</span>
										{active && (
											<span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-cx-gold/30 via-cx-flame/25 to-cx-pink/30" aria-hidden="true" />
										)}
									</Link>
								);
							})}
						</nav>
									<div className="flex items-center gap-2">
										<ThemeToggle />
										<Link
											href="/profile"
											className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-xs font-semibold text-white backdrop-blur-sm transition-colors duration-150 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cx-pink"
											aria-label="Open profile"
										>
											ME
										</Link>
									</div>
					</div>
				</header>

				{/* Mobile nav */}
				<nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/70 px-4 py-2 backdrop-blur-xl md:hidden">
					<ul className="flex items-center justify-between text-[11px] font-medium text-cx-muted">
						{navItems.map((item) => {
							const active = pathname.startsWith(item.href);
							return (
								<li key={item.href} className="flex-1">
									<Link
										href={item.href}
										className="flex flex-col items-center gap-1 rounded-full px-2 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cx-gold"
									>
										<span
											className={
												active
													? 'h-1 w-6 rounded-full bg-gradient-to-r from-cx-gold via-cx-flame to-cx-pink'
													: 'h-1 w-6 rounded-full bg-white/10'
											}
											aria-hidden="true"
										/>
										<span className={active ? 'text-white' : 'text-cx-muted'}>{item.label}</span>
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>

				<div className="pb-16 md:pb-0">
					<AnimatePresence mode="wait">
						<motion.main
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
			</div>
		</AuthProvider>
	);
}

