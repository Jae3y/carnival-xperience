"use client";

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const shouldReduceMotion = useReducedMotion();

	const cardVariants = shouldReduceMotion
		? {
			initial: { opacity: 0 },
			animate: { opacity: 1 },
		}
		: {
			initial: { opacity: 0, y: 16, scale: 0.98 },
			animate: { opacity: 1, y: 0, scale: 1 },
		};

	return (
		<div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-cx-deep via-cx-night to-background p-4 text-foreground">
			{/* Subtle background orbs */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="cx-orb cx-orb-1 opacity-40" />
				<div className="cx-orb cx-orb-3 opacity-30" />
			</div>

			<div className="relative z-10 w-full max-w-md">
				<div className="mb-8 text-center">
					<Link href="/" className="inline-flex items-center space-x-2">
						<span className="text-3xl" aria-hidden="true">
							🎭
						</span>
						<span className="bg-gradient-to-r from-cx-gold via-cx-flame to-cx-pink bg-clip-text text-2xl font-bold text-transparent">
							CarnivalXperience
						</span>
					</Link>
					<p className="mt-2 text-sm text-cx-muted">
						Your ultimate Calabar Carnival companion
					</p>
				</div>
				<motion.div
					className="rounded-3xl border border-white/10 bg-black/60 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl"
					initial={cardVariants.initial}
					animate={cardVariants.animate}
					transition={{ duration: shouldReduceMotion ? 0.15 : 0.35, ease: 'easeOut' }}
				>
					{children}
				</motion.div>
			</div>
			<footer className="relative z-10 mt-8 text-center text-xs text-cx-muted">
				<p>© {new Date().getFullYear()} CarnivalXperience. All rights reserved.</p>
			</footer>
		</div>
	);
}

