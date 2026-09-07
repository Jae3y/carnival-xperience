"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  Hotel, 
  Trophy, 
  Radio, 
  ArrowRight,
  Flame,
  Clock,
  Compass,
  CheckCircle2,
  ChevronRight,
  PhoneCall,
  Utensils
} from "lucide-react";
import { Header } from "@/components/navigation/header";
import { Footer } from "@/components/navigation/footer";

// Calabar Carnival runs annually throughout December (1 Dec - 31 Dec) in Calabar, Cross River State.
function getCarnivalTimeline() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const thisYearStart = new Date(currentYear, 11, 1, 18, 0); // 1 Dec 6:00 PM
  const thisYearEnd = new Date(currentYear, 11, 31, 23, 59, 59); // 31 Dec 11:59 PM

  if (now < thisYearStart) {
    return { target: thisYearStart, isLive: false, year: currentYear };
  } else if (now <= thisYearEnd) {
    return { target: thisYearEnd, isLive: true, year: currentYear };
  } else {
    return { target: new Date(currentYear + 1, 11, 1, 18, 0), isLive: false, year: currentYear + 1 };
  }
}

function getTimeUntilTarget(target: Date) {
  return Math.max(0, target.getTime() - Date.now());
}

function formatCountdown(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

// Band details with authentic Cross River heritage
const BANDS = [
  {
    id: "seagull",
    name: "Seagull Band",
    color: "from-rose-500 to-amber-500",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    motto: "The Patriotic Red Flame",
    points: 2840,
    leader: "Sen. Florence Ita Giwa",
    vibe: "Majestic costumes, intricate feathered headpieces, synchronized choreography",
  },
  {
    id: "passion4",
    name: "Passion 4 Band",
    color: "from-emerald-500 to-teal-500",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    motto: "Six-Time Overall Champions",
    points: 2795,
    leader: "Chris Agibe",
    vibe: "Largest marching contingent, theatrical carnival floats, thunderous percussion",
  },
  {
    id: "mastablasta",
    name: "Masta Blasta Band",
    color: "from-orange-500 to-amber-600",
    badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    motto: "The Club of Champions",
    points: 2710,
    leader: "Mayen Adetiba",
    vibe: "Youthful electric energy, contemporary afrobeats, dynamic street stunts",
  },
  {
    id: "freedom",
    name: "Freedom Band",
    color: "from-yellow-500 to-sky-600",
    badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    motto: "Spirit of Independence",
    points: 2640,
    leader: "Capt. Henry Brisibe",
    vibe: "Bold maritime themes, rich gold embroidery, historic storytelling",
  },
  {
    id: "bayside",
    name: "Bayside Band",
    color: "from-blue-500 to-cyan-500",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    motto: "Coastal Elegance",
    points: 2590,
    leader: "Donald Duke",
    vibe: "Foundational band, royal blue pageantry, refined jazz and brass arrangements",
  },
];

const ROUTE_CHECKPOINTS = [
  {
    step: "01",
    name: "Millennium Park Flag-Off",
    distance: "0.0 km",
    desc: "Opening grandstand, VIP viewing pavilions, and official band assembly.",
    status: "Assembly & Staging",
  },
  {
    step: "02",
    name: "Mary Slessor Avenue",
    distance: "3.4 km",
    desc: "Primary adjudication stage with high-output sound trucks and first aid hub.",
    status: "Judging Point 1",
  },
  {
    step: "03",
    name: "Marian Road & MCC Junction",
    distance: "7.8 km",
    desc: "Epicenter of street revelry, artisan food markets, and open crowd dancing.",
    status: "High Energy Zone",
  },
  {
    step: "04",
    name: "U.J. Esuene Stadium",
    distance: "12.0 km",
    desc: "Grand finale arena: costume fireworks, final scores, and international gala.",
    status: "Final Destination",
  },
];

const DECEMBER_KEY_DATES = [
  {
    date: "Dec 1",
    title: "Tree Lighting & Christmas Village Flag-Off",
    venue: "Calabar Botanical Garden",
    category: "Official Opening",
  },
  {
    date: "Dec 26",
    title: "Cross River State Cultural Carnival",
    venue: "U.J. Esuene Stadium to Mary Slessor",
    category: "18 Local Govts",
  },
  {
    date: "Dec 27",
    title: "Bikers Carnival & Exotic Cars Parade",
    venue: "12km Carnival Circuit",
    category: "High-Octane Stunts",
  },
  {
    date: "Dec 28",
    title: "The Main Street Carnival (The Big Parade)",
    venue: "Millennium Park to Stadium",
    category: "5 Competing Bands",
  },
  {
    date: "Dec 29",
    title: "International Carnival Pageant",
    venue: "U.J. Esuene Stadium",
    category: "Global Delegations",
  },
  {
    date: "Dec 31",
    title: "Grand Finale Musical Concert & Fireworks",
    venue: "U.J. Esuene Stadium",
    category: "New Year Celebration",
  },
];

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const [timeline, setTimeline] = useState(() => getCarnivalTimeline());
  const [timeRemaining, setTimeRemaining] = useState(() =>
    getTimeUntilTarget(timeline.target)
  );

  const [activeTab, setActiveTab] = useState<"route" | "bands" | "calendar" | "essentials">("route");
  const [votedBand, setVotedBand] = useState<string | null>(null);
  const [voterCounts, setVoterCounts] = useState<{ [key: string]: number }>({
    seagull: 2840,
    passion4: 2795,
    mastablasta: 2710,
    freedom: 2640,
    bayside: 2590,
  });

  useEffect(() => {
    const update = () => {
      const currentTimeline = getCarnivalTimeline();
      setTimeline(currentTimeline);
      setTimeRemaining(getTimeUntilTarget(currentTimeline.target));
    };

    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const handleBandVote = (bandId: string) => {
    if (votedBand === bandId) return;
    setVotedBand(bandId);
    setVoterCounts((prev) => ({
      ...prev,
      [bandId]: prev[bandId] + 1,
    }));
  };

  const { days, hours, minutes, seconds } = formatCountdown(timeRemaining);

  // Emil Kowalski transition config: sub-250ms duration, custom ease-out, no scale from 0
  const smoothFade = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.15 } }
    : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.22, ease: [0.23, 1, 0.32, 1] } };

  return (
    <div className="min-h-screen bg-[#07090e] text-[#ededee] overflow-x-hidden flex flex-col selection:bg-amber-400 selection:text-black">
      {/* Top Crafted Header */}
      <Header />

      {/* Atmospheric subtle stage grid */}
      <div className="pointer-events-none fixed inset-0 cx-stage-grid opacity-40 z-0" aria-hidden="true" />

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left: Editorial Hero Narrative */}
          <motion.div className="lg:col-span-7 space-y-6" {...smoothFade}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-xs font-medium text-white/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Calabar &bull; Cross River State &bull; Dec 1–31</span>
            </div>

            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.08]">
              The Rhythm of Calabar.
              <span className="block text-white/60 font-semibold text-2xl sm:text-3xl lg:text-4xl mt-2 tracking-normal">
                31 Days of Pure African Energy.
              </span>
            </h1>

            <p className="max-w-xl text-base text-white/70 leading-relaxed sm:text-lg">
              Every December, Calabar transforms into the world&apos;s most electric cultural capital. 
              Navigate 12 kilometres of uninterrupted pageantry, support the 5 legendary bands, 
              book verified hotels along the route, and stay protected with live 24/7 security.
            </p>

            {/* Tactile Action Controls (Emil Kowalski: active:scale-[0.97], duration-140) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/events"
                className="group inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3.5 text-sm font-bold text-black transition-[transform,background-color] duration-140 ease-out hover:bg-amber-300 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <span>Explore 120+ Events</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-140 group-hover:translate-x-0.5" />
              </Link>

              <Link
                href="/map"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] transition-[transform,background-color,border-color] duration-140 ease-out hover:bg-white/[0.08] hover:border-white/30 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <Compass className="h-4 w-4 text-amber-400" />
                <span>Interactive Route Map</span>
              </Link>
            </div>

            {/* Grounded Trust Anchors */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-4 text-xs text-white/50 border-t border-white/[0.08]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>12km Mary Slessor Circuit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5 text-amber-400" />
                <span>5 Competing Band Pageants</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-sky-400" />
                <span>112 Emergency Hub Active</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Tactile Festival Radar Console */}
          <motion.div className="lg:col-span-5" {...smoothFade} transition={{ delay: 0.08 }}>
            <div className="cx-surface rounded-3xl p-6 sm:p-7 space-y-6">
              {/* Header Status */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                    Official Countdown
                  </span>
                  <p className="text-base font-bold text-white mt-0.5">
                    {timeline.isLive ? `Calabar Carnival ${timeline.year} Live` : `Calabar Carnival ${timeline.year}`}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{timeline.isLive ? "Active Now" : "Counting Down"}</span>
                </div>
              </div>

              {/* Tactile Flip Counter with Tabular Digits */}
              <div className="grid grid-cols-4 gap-2.5 text-center">
                <div className="rounded-2xl border border-white/[0.08] bg-black/50 p-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
                  <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-white tabular-nums">
                    {days}
                  </span>
                  <span className="block text-[10px] uppercase font-semibold tracking-wider text-white/40 mt-1">
                    Days
                  </span>
                </div>
                <div className="rounded-2xl border border-white/[0.08] bg-black/50 p-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
                  <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-amber-300 tabular-nums">
                    {hours.toString().padStart(2, "0")}
                  </span>
                  <span className="block text-[10px] uppercase font-semibold tracking-wider text-white/40 mt-1">
                    Hours
                  </span>
                </div>
                <div className="rounded-2xl border border-white/[0.08] bg-black/50 p-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
                  <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-white tabular-nums">
                    {minutes.toString().padStart(2, "0")}
                  </span>
                  <span className="block text-[10px] uppercase font-semibold tracking-wider text-white/40 mt-1">
                    Mins
                  </span>
                </div>
                <div className="rounded-2xl border border-white/[0.08] bg-black/50 p-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
                  <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-rose-400 tabular-nums">
                    {seconds.toString().padStart(2, "0")}
                  </span>
                  <span className="block text-[10px] uppercase font-semibold tracking-wider text-white/40 mt-1">
                    Secs
                  </span>
                </div>
              </div>

              {/* Live Route Intelligence Banner */}
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-white/80 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-amber-400" />
                    <span>Route Radar</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                    Greenway Verified
                  </span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  Millennium Park &rarr; Mary Slessor &rarr; Marian Road &rarr; U.J. Esuene Stadium. 15 first-aid points and 4 viewing grandstands active.
                </p>
                <div className="pt-1 flex items-center justify-between text-xs">
                  <Link
                    href="/map"
                    className="inline-flex items-center gap-1 font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    <span>View Waypoints</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="/hotels"
                    className="inline-flex items-center gap-1 font-semibold text-white/70 hover:text-white transition-colors"
                  >
                    <span>Hotels Near Route</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Quick AI Question Seed */}
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] px-4 py-3 text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
                  <span className="text-white/80 font-medium">
                    &ldquo;Best spot for Children&apos;s Carnival parade?&rdquo;
                  </span>
                </div>
                <Link
                  href="/concierge?q=Best+spot+for+Children%27s+Carnival+parade"
                  className="shrink-0 rounded-lg bg-amber-400 px-2.5 py-1 text-[11px] font-bold text-black transition-[transform,background-color] duration-140 ease-out hover:bg-amber-300 active:scale-[0.96]"
                >
                  Ask
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Interactive Exploration Console (Replacing Generic AI Bento Grid) */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-white/[0.08] pb-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
              <Flame className="h-3.5 w-3.5" />
              <span>Interactive Festival Directory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Explore Calabar by Experience
            </h2>
          </div>

          {/* Emil Kowalski Tactile Segmented Tabs */}
          <div
            className="flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] p-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] overflow-x-auto max-w-full"
            role="tablist"
            aria-label="Experience Categories"
          >
            {[
              { id: "route", label: "12km Route" },
              { id: "bands", label: "5 Bands" },
              { id: "calendar", label: "Key Dates" },
              { id: "essentials", label: "Stays & Safety" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-[transform,background-color,color] duration-140 ease-out whitespace-nowrap active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    isActive
                      ? "bg-white text-black shadow-sm"
                      : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content 1: The 12km Route */}
        {activeTab === "route" && (
          <motion.div
            key="tab-route"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            <div className="md:col-span-8 cx-surface rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    The Official 12-Kilometre Circuit
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Four Iconic Adjudication Stations
                  </h3>
                </div>
                <Link
                  href="/map"
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-white transition-[transform,background-color] duration-140 ease-out hover:bg-white/[0.1] active:scale-[0.96]"
                >
                  <span>Open Full Map</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ROUTE_CHECKPOINTS.map((pt) => (
                  <div
                    key={pt.step}
                    className="rounded-2xl border border-white/[0.08] bg-black/40 p-4 space-y-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-400">
                        KM {pt.distance}
                      </span>
                      <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-white/70">
                        {pt.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{pt.name}</h4>
                    <p className="text-xs text-white/60 leading-relaxed">{pt.desc}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] text-xs text-white/60">
                <span>Free entry along the entire 12km street course. Paid grandstand tickets available for U.J. Esuene Stadium.</span>
                <Link href="/map" className="font-semibold text-amber-400 hover:text-amber-300 transition-colors">
                  Check First Aid Posts &rarr;
                </Link>
              </div>
            </div>

            <div className="md:col-span-4 cx-surface rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                  <Compass className="h-3.5 w-3.5" />
                  <span>Interactive Geo-Tracking</span>
                </div>
                <h3 className="text-lg font-bold text-white">Live Band Location Tracker</h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Never miss your favorite band. See real-time GPS telemetry of sound trucks, crowd density indicators, and road reopening timetables.
                </p>
                <div className="rounded-2xl border border-white/[0.08] bg-black/30 p-3 space-y-1 text-xs">
                  <div className="flex justify-between text-white/80 font-medium">
                    <span>Current Leading Truck</span>
                    <span className="text-rose-400">Seagull Band</span>
                  </div>
                  <div className="flex justify-between text-white/50 text-[11px]">
                    <span>Approaching</span>
                    <span>Marian Road Junction</span>
                  </div>
                </div>
              </div>

              <Link
                href="/map"
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-xs font-bold text-black transition-[transform,background-color] duration-140 ease-out hover:bg-white/90 active:scale-[0.97]"
              >
                <span>Launch Live Route Map</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Tab Content 2: The 5 Competing Bands */}
        {activeTab === "bands" && (
          <motion.div
            key="tab-bands"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {BANDS.map((band) => {
                const hasVoted = votedBand === band.id;
                const voteTotal = voterCounts[band.id];
                return (
                  <div
                    key={band.id}
                    className="cx-surface rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-white/20 transition-colors duration-140"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${band.badgeColor}`}>
                          {band.motto}
                        </span>
                        <span className="font-mono text-xs font-bold text-amber-300">
                          {voteTotal.toLocaleString()} votes
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white">{band.name}</h3>
                      <p className="text-xs text-white/50 font-medium">Led by {band.leader}</p>
                      <p className="text-xs text-white/70 leading-relaxed">{band.vibe}</p>
                    </div>

                    <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
                      <Link
                        href="/bands"
                        className="text-xs font-semibold text-white/60 hover:text-white transition-colors"
                      >
                        Band Dossier &rarr;
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleBandVote(band.id)}
                        disabled={hasVoted}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-[transform,background-color,color] duration-140 ease-out active:scale-[0.96] ${
                          hasVoted
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default"
                            : "bg-white text-black hover:bg-amber-300"
                        }`}
                      >
                        {hasVoted ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Voted</span>
                          </>
                        ) : (
                          <>
                            <Trophy className="h-3 w-3" />
                            <span>Cast Vote</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cx-surface rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
              <span className="text-white/60">
                Official band judging occurs on December 28th across Mary Slessor Avenue, Marian Road, and U.J. Esuene Stadium.
              </span>
              <Link href="/bands" className="font-semibold text-amber-400 hover:text-amber-300 transition-colors">
                View Official Adjudication Criteria &rarr;
              </Link>
            </div>
          </motion.div>
        )}

        {/* Tab Content 3: Key December Dates */}
        {activeTab === "calendar" && (
          <motion.div
            key="tab-calendar"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="cx-surface rounded-3xl p-6 sm:p-8 space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Month-Long Festival Roster
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Marquee Calendar Highlights
                </h3>
              </div>
              <Link
                href="/events"
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-xs font-semibold text-white transition-[transform,background-color] duration-140 ease-out hover:bg-white/[0.1] active:scale-[0.96]"
              >
                <span>Full 120+ Events Calendar</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DECEMBER_KEY_DATES.map((item) => (
                <div
                  key={item.date}
                  className="rounded-2xl border border-white/[0.08] bg-black/40 p-4 space-y-2.5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-lg">
                        {item.date}
                      </span>
                      <span className="text-[11px] font-medium text-white/50">{item.category}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-2 leading-snug">{item.title}</h4>
                    <div className="flex items-center gap-1.5 text-xs text-white/60 mt-1">
                      <MapPin className="h-3 w-3 text-white/40 shrink-0" />
                      <span className="truncate">{item.venue}</span>
                    </div>
                  </div>

                  <Link
                    href="/events"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors pt-2 border-t border-white/[0.06]"
                  >
                    <span>Event Details & Reminders</span>
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tab Content 4: Stays & Safety */}
        {activeTab === "essentials" && (
          <motion.div
            key="tab-essentials"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Hotels & Stays Card */}
            <div className="cx-surface rounded-3xl p-6 sm:p-8 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300 border border-amber-400/20">
                  <Hotel className="h-3.5 w-3.5" />
                  <span>Curated Accommodations</span>
                </div>
                <h3 className="text-xl font-bold text-white">40+ Verified Stays Near the Route</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Hotels in Calabar sell out fast during December. Browse curated stays within walking distance of Mary Slessor Avenue and Millennium Park with verified festival pricing and Paystack card booking.
                </p>
                <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-3 space-y-2 text-xs">
                  <div className="flex justify-between text-white/90 font-medium">
                    <span>Transcorp Hotels Calabar</span>
                    <span className="text-amber-300 font-mono font-bold">₦85,000/nt</span>
                  </div>
                  <div className="flex justify-between text-white/50 text-[11px]">
                    <span>0.4 km from Millennium Park Flag-Off</span>
                    <span className="text-emerald-400">Verified Partner</span>
                  </div>
                </div>
              </div>

              <Link
                href="/hotels"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-xs font-bold text-black transition-[transform,background-color] duration-140 ease-out hover:bg-white/90 active:scale-[0.97]"
              >
                <span>Find & Book Accommodations</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Safety & Emergency Card */}
            <div className="cx-surface rounded-3xl p-6 sm:p-8 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-300 border border-rose-500/20">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>24/7 Security & Health</span>
                </div>
                <h3 className="text-xl font-bold text-white">State Security & Family Safety</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Your safety is our top priority. Access one-tap 112 emergency calling, share time-limited live location with your group, and report lost items along the parade route.
                </p>
                <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-white/90 font-medium">
                    <span className="flex items-center gap-1.5">
                      <PhoneCall className="h-3.5 w-3.5 text-rose-400" />
                      <span>Direct Emergency Dispatch</span>
                    </span>
                    <span className="font-mono font-bold text-rose-400">112 (Toll-Free)</span>
                  </div>
                  <p className="text-[11px] text-white/50">
                    Joint Task Force stations located at every 800m marker along Mary Slessor Avenue.
                  </p>
                </div>
              </div>

              <Link
                href="/safety"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-bold text-rose-300 transition-[transform,background-color] duration-140 ease-out hover:bg-rose-500/20 active:scale-[0.97]"
              >
                <span>Open Safety Center</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </section>

      {/* AI Concierge & Cultural Intelligence Callout */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="cx-surface rounded-3xl p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Culturally Trained AI Companion</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Ask the Calabar Digital Concierge
              </h3>
              <p className="text-sm text-white/70 leading-relaxed max-w-xl">
                Trained on the 20-year history of the carnival, local Efik and Ibibio culture, parade rules, authentic culinary spots for Edikang Ikong and Afang soup, and transport advice.
              </p>

              <div className="flex flex-wrap gap-2 pt-2 text-xs">
                <Link
                  href="/concierge?q=Where+can+I+get+authentic+Edikang+Ikong+soup+in+Calabar%3F"
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-white/80 transition-[transform,background-color] duration-140 ease-out hover:bg-white/[0.08] active:scale-[0.97]"
                >
                  &ldquo;Where can I get authentic Edikang Ikong soup?&rdquo;
                </Link>
                <Link
                  href="/concierge?q=What+time+does+the+Bikers+Carnival+start+on+Dec+27%3F"
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-white/80 transition-[transform,background-color] duration-140 ease-out hover:bg-white/[0.08] active:scale-[0.97]"
                >
                  &ldquo;What time does Bikers Carnival start?&rdquo;
                </Link>
                <Link
                  href="/concierge?q=Where+is+the+safest+viewing+grandstand+for+families%3F"
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-white/80 transition-[transform,background-color] duration-140 ease-out hover:bg-white/[0.08] active:scale-[0.97]"
                >
                  &ldquo;Safest viewing grandstand for families?&rdquo;
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <Link
                href="/concierge"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-6 py-4 text-sm font-bold text-black shadow-md transition-[transform,background-color] duration-140 ease-out hover:bg-amber-300 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <Sparkles className="h-4 w-4" />
                <span>Open Instant AI Concierge</span>
              </Link>

              <Link
                href="/culture"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-6 py-4 text-sm font-semibold text-white transition-[transform,background-color] duration-140 ease-out hover:bg-white/[0.08] active:scale-[0.97]"
              >
                <Utensils className="h-4 w-4 text-amber-400" />
                <span>Cross River Heritage Guide</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live Broadcast Feed Strip */}
      <section className="relative z-10 border-t border-white/[0.08] bg-black/40 backdrop-blur-xl py-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
              <Radio className="h-4 w-4 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-white">Live Carnival Broadcast Network</span>
              <p className="text-white/50 text-[11px]">
                Ground dispatch from Mary Slessor Avenue, Millennium Park, and U.J. Esuene Stadium.
              </p>
            </div>
          </div>

          <Link
            href="/live"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-white transition-[transform,background-color] duration-140 ease-out hover:bg-white/[0.1] active:scale-[0.97]"
          >
            <span>Open Real-Time Feed</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>

      {/* Site-wide Footer */}
      <Footer />
    </div>
  );
}
