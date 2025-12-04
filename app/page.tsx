"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const fadeInUp = {
	initial: { opacity: 0, y: 40 },
	whileInView: { opacity: 1, y: 0 },
	transition: { duration: 0.8, ease: "easeOut" },
};

const staggerContainer = {
	initial: { opacity: 0 },
	whileInView: { opacity: 1 },
	transition: { staggerChildren: 0.15 },
};

const features = [
	{ name: "Events", description: "See official parades, concerts, band competitions and street parties.", href: "/events" },
	{ name: "Hotels", description: "Stay close to Calabar's main carnival routes and arenas.", href: "/hotels" },
	{ name: "Interactive Map", description: "Track routes, stages, viewing points and key landmarks.", href: "/map" },
	{ name: "AI Concierge", description: "Ask anything about Calabar Carnival in real time.", href: "/concierge" },
	{ name: "Safety Center", description: "Emergency tools, family finder and practical safety tips.", href: "/safety" },
	{ name: "Profile", description: "Save your plans, favourites and emergency contacts.", href: "/profile" },
];

// Calabar Carnival runs every December in Calabar, Cross River State.
// Use the opening of the festival (1 December, 6pm Africa/Lagos) as the countdown anchor.
function getNextCarnivalStart() {
	const now = new Date();
	const year = now.getMonth() > 10 ? now.getFullYear() + 1 : now.getFullYear();
	return new Date(year, 11, 1, 18, 0);
}

function getTimeUntilCarnival(target: Date) {
	return Math.max(0, target.getTime() - Date.now());
}

function formatCarnivalCountdown(milliseconds: number) {
	const totalSeconds = Math.floor(milliseconds / 1000);
	const days = Math.floor(totalSeconds / 86400);
	const hours = Math.floor((totalSeconds % 86400) / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	return { days, hours, minutes, seconds };
}

export default function Home() {
	const shouldReduceMotion = useReducedMotion();
	const [timeToCarnival, setTimeToCarnival] = useState(() =>
		getTimeUntilCarnival(getNextCarnivalStart()),
	);

	useEffect(() => {
		const target = getNextCarnivalStart();
		const update = () => {
			setTimeToCarnival(getTimeUntilCarnival(target));
		};

		update();
		const interval = window.setInterval(update, 1000);
		return () => window.clearInterval(interval);
	}, []);

	useEffect(() => {
			if (shouldReduceMotion) return;

			const ctx = gsap.context(() => {
				gsap.to(".cx-orb-1", {
					x: 60,
					y: 40,
					scale: 1.1,
					duration: 18,
					repeat: -1,
					yoyo: true,
					ease: "sine.inOut",
				});

				gsap.to(".cx-orb-2", {
					x: -40,
					y: 30,
					scale: 1.15,
					duration: 22,
					repeat: -1,
					yoyo: true,
					ease: "sine.inOut",
				});

				gsap.to(".cx-orb-3", {
					y: -30,
					scale: 1.05,
					opacity: 0.9,
					duration: 20,
					repeat: -1,
					yoyo: true,
					ease: "sine.inOut",
				});
			});

				return () => ctx.revert();
			}, [shouldReduceMotion]);

	const { days, hours, minutes, seconds } = formatCarnivalCountdown(timeToCarnival);
	const countdownLabel =
		timeToCarnival > 0 ? "Countdown to opening (1 Dec, Calabar)" : "Calabar Carnival is live";
	const countdownValue =
		timeToCarnival > 0
			? `${days}d ${hours.toString().padStart(2, "0")}:${minutes
					.toString()
					.padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
			: "On now";

	return (
		<motion.main
			className="min-h-screen bg-gradient-radial from-cx-deep via-cx-night to-background text-foreground overflow-hidden"
		>
			{/* Floating carnival orbs */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="cx-orb cx-orb-1" />
				<div className="cx-orb cx-orb-2" />
				<div className="cx-orb cx-orb-3" />
			</div>

			<section className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-16 px-6 py-24 md:flex-row md:items-center">
				<div className="absolute right-6 top-8 z-20">
					<ThemeToggle />
				</div>
				{/* Hero copy */}
				<motion.div
					className="max-w-xl space-y-6"
					{...fadeInUp}
				>
						<motion.span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary shadow-sm ring-1 ring-primary/30">
						<span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-gradient-to-tr from-amber-400 to-pink-500" />
							Live the Calabar Carnival before you arrive
					</motion.span>
					<motion.h1 className="text-balance text-4xl font-black leading-tight text-white drop-shadow-lg md:text-6xl">
						Your Ultimate
						<span className="bg-gradient-to-r from-cx-gold via-cx-flame to-cx-pink bg-clip-text text-transparent"> CarnivalXperience</span>
					</motion.h1>
						<motion.p className="max-w-prose text-base text-cx-muted md:text-lg">
							Plan your trip to Africa&apos;s Biggest Street Party – a month-long December festival in Calabar, Cross River State – with real events, places to stay and safety tools in one place.
						</motion.p>

					<div className="mt-6 flex flex-wrap items-center gap-4">
						<Link
							href="/events"
							className="group inline-flex items-center rounded-full bg-gradient-to-r from-cx-gold via-cx-flame to-cx-pink px-6 py-3 text-sm font-semibold text-cx-deep shadow-xl shadow-cx-flame/40 transition-transform transition-shadow duration-200 hover:scale-[1.03] hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cx-gold"
						>
							Start exploring events
							<span className="ml-2 inline-block translate-x-0 transition-transform group-hover:translate-x-1">
								{"\u2192"}
							</span>
						</Link>
						<Link href="/concierge" className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cx-pink">
							Meet your AI concierge
						</Link>
					</div>
						<p className="mt-4 text-xs text-cx-muted">
							Follow official parades, concerts and cultural shows, find hotels near the main routes, and stay connected with friends and family while you enjoy the carnival.
						</p>
				</motion.div>

				{/* Hero visual */}
				<motion.div
					className="relative mt-12 w-full max-w-md md:mt-0 md:w-1/2"
					{...staggerContainer}
				>
					<motion.div
						className="relative rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl"
						{...fadeInUp}
					>
						<div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
								<div>
									<p className="text-xs uppercase tracking-wide text-cx-muted">Next highlight in Calabar</p>
									<p className="text-sm font-semibold text-white">Calabar Carnival Opening Festival</p>
								</div>
								<div className="flex flex-col items-end text-right">
									<p className="text-[10px] text-cx-muted">{countdownLabel}</p>
									<p className="text-lg font-bold text-cx-gold tabular-nums">{countdownValue}</p>
								</div>
						</div>
						<div className="mt-4 grid grid-cols-3 gap-3 text-xs text-cx-muted">
							<div className="rounded-2xl bg-black/25 p-3">
								<p className="text-[10px] uppercase tracking-wide text-cx-muted">Events</p>
								<p className="mt-1 text-sm font-semibold text-white">120+</p>
								<p className="mt-1 text-[11px] text-cx-muted">from street parties to VIP shows</p>
							</div>
							<div className="rounded-2xl bg-black/25 p-3">
								<p className="text-[10px] uppercase tracking-wide text-cx-muted">Hotels</p>
								<p className="mt-1 text-sm font-semibold text-white">40+</p>
								<p className="mt-1 text-[11px] text-cx-muted">curated stays near the route</p>
							</div>
							<div className="rounded-2xl bg-black/25 p-3">
								<p className="text-[10px] uppercase tracking-wide text-cx-muted">Safe Zones</p>
								<p className="mt-1 text-sm font-semibold text-white">15</p>
								<p className="mt-1 text-[11px] text-cx-muted">mapped with live access</p>
							</div>
						</div>
					</motion.div>
					<motion.div
						className="absolute -right-6 -bottom-10 w-40 rounded-3xl border border-cx-pink/40 bg-gradient-to-br from-cx-pink/90 via-cx-flame/90 to-cx-gold/90 p-3 text-xs text-cx-deep shadow-2xl"
						{...fadeInUp}
						transition={{ ...fadeInUp.transition, delay: 0.25 }}
					>
						<p className="text-[10px] font-semibold uppercase tracking-wide">AI Concierge</p>
						<p className="mt-1 text-[11px]">
							Recommended: arrive at Millennium Park by 6:30pm for the best view.
						</p>
					</motion.div>
					<motion.div
						className="absolute -left-4 -top-6 w-32 rounded-3xl border border-white/15 bg-black/60 p-3 text-[11px] text-cx-muted"
						{...fadeInUp}
						transition={{ ...fadeInUp.transition, delay: 0.4 }}
					>
						<p className="text-[10px] uppercase tracking-wide text-cx-muted">Live map</p>
						<p className="mt-1 text-xs text-white">See parades, stages & safe routes in real time.</p>
					</motion.div>
				</motion.div>
			</section>

			{/* Features section */}
			<section id="features" className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
				<div className="mb-10 flex items-center justify-between gap-4">
					<div>
						<h2 className="text-2xl font-semibold text-white md:text-3xl">Everything you need for Calabar Carnival</h2>
						<p className="mt-2 max-w-xl text-sm text-cx-muted md:text-base">
							Plan your days, find your nights, and stay safe with a single, beautifully crafted carnival companion.
						</p>
					</div>
					<Link href="/signup" className="hidden rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-white/10 md:inline-flex">
						Create your carnival profile
					</Link>
				</div>
				<motion.div
					className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
					initial="initial"
					whileInView="whileInView"
					viewport={{ once: true, margin: "-80px" }}
				>
					{features.map((feature, idx) => (
						<motion.div
							key={feature.name}
							className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-cx-muted shadow-lg backdrop-blur-xl transition hover:-translate-y-1 hover:border-cx-gold/50 hover:bg-white/10"
							variants={fadeInUp}
							transition={{ ...fadeInUp.transition, delay: idx * 0.05 }}
						>
							<div className="absolute inset-0 bg-gradient-to-br from-cx-gold/0 via-cx-flame/0 to-cx-pink/0 opacity-0 transition group-hover:opacity-100" />
							<div className="relative flex flex-col gap-2">
								<p className="text-xs font-semibold uppercase tracking-wide text-cx-gold/90">
									{feature.name}
								</p>
								<p className="text-[13px] text-cx-muted group-hover:text-white">
									{feature.description}
								</p>
							<Link
								href={feature.href}
								className="mt-2 inline-flex items-center text-[11px] font-medium text-cx-gold hover:text-cx-pink"
							>
								Open {feature.name}
								<span className="ml-1 inline-block translate-x-0 transition-transform group-hover:translate-x-1">
									{"\u2192"}
								</span>
							</Link>
							</div>
						</motion.div>
					))}
				</motion.div>
			</section>
		</motion.main>
	);
}
