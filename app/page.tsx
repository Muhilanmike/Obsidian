import Link from 'next/link'
import SwarmCursor from '@/components/SwarmCursor'
import AnimatedContent from '@/components/AnimatedContent'
import {
  Shield,
  Radar,
  Search,
  Activity,
  ArrowRight,
  ExternalLink,
  Terminal,
  Crosshair,
  Zap,
  Lock,
} from 'lucide-react'

const features = [
  {
    icon: Radar,
    title: 'Live Network Scanning',
    description:
      'Real-time target IP scoping, port enumeration (80, 443, 8080…), and vulnerability mapping with full Nmap integration.',
    badge: 'RECON',
    accent: 'amber',
  },
  {
    icon: Search,
    title: 'Standalone CVE Lookup',
    description:
      'Instant NVD 2.0 correlation for specific software versions (Node.js, Apache, nginx) with CVSS severity filtering.',
    badge: 'CVE',
    accent: 'orange',
  },
  {
    icon: Activity,
    title: 'Telemetry & Posture Auditing',
    description:
      'Deep HTTP security header grading, TLS certificate inspector, and automated executive summary reporting.',
    badge: 'AUDIT',
    accent: 'emerald',
  },
] as const

const stats = [
  { label: 'NVD CVEs Indexed', value: '240K+' },
  { label: 'Headers Graded', value: '12' },
  { label: 'TLS Protocols', value: 'v1.2 / 1.3' },
  { label: 'Scan Latency', value: '<3s' },
]

export default function LandingPage() {
  return (
    <div className="bg-[#050505] text-white min-h-screen relative overflow-hidden">
      {/* ── Ambient Background Effects ───────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Radial amber glow top-center */}
        <div className="absolute inset-x-0 -top-40 h-[80vh] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(245,158,11,0.18),transparent_70%)]" />
        {/* Secondary glow right */}
        <div className="absolute -right-40 top-20 h-[60vh] w-[60vw] bg-[radial-gradient(ellipse_50%_60%_at_80%_20%,rgba(245,158,11,0.06),transparent_70%)]" />
        {/* Grid overlay */}
        <div className="grid-fade absolute inset-x-0 top-0 h-[70vh]" />
        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050505] to-transparent" />
      </div>

      {/* ── Navbar ───────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="flex size-9 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 shadow-[0_0_14px_rgba(245,158,11,0.2)] transition-colors group-hover:border-amber-500/50">
              <Shield className="size-4 text-amber-400" />
            </span>
            <span className="text-sm font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
              Obsidian
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-slate-400 md:flex">
            <a href="#features" className="transition-colors hover:text-white">
              Features
            </a>
            <a href="#metrics" className="transition-colors hover:text-white">
              Metrics
            </a>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition-all hover:scale-[1.03] hover:shadow-[0_8px_30px_-8px_rgba(245,158,11,0.5)]"
            >
              Launch Dashboard
              <ArrowRight className="size-3.5" />
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero Section with SwarmCursor ────────────────────────── */}
      <div className="relative w-full h-[90vh] min-h-[640px] max-h-[880px] flex items-center justify-center overflow-hidden bg-[#050505]">
        <SwarmCursor
          count={800}
          size={2.6}
          spread={90}
          swirl={0.6}
          color="#f59e0b"
          clickEffect="burst"
        >
          <div className="flex flex-col items-center justify-center h-full text-center px-4 z-10 relative max-w-4xl mx-auto">
            {/* Cyber Shield / Glowing Radar Target Icon */}
            <div className="relative mb-5 flex items-center justify-center">
              <div className="absolute size-24 rounded-full bg-amber-500/25 blur-xl pointer-events-none" />
              <div className="relative flex size-18 items-center justify-center rounded-2xl border border-amber-500/40 bg-[#0d0d0f]/90 shadow-[0_0_30px_rgba(245,158,11,0.3)] backdrop-blur-md">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]"
                  aria-hidden="true"
                >
                  {/* Outer Shield Contour */}
                  <path
                    d="M24 4L39 10V21.5C39 31.2 32.5 39.8 24 43.5C15.5 39.8 9 31.2 9 21.5V10L24 4Z"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Radar Pulse Ring */}
                  <circle
                    cx="24"
                    cy="23"
                    r="7.5"
                    stroke="#f59e0b"
                    strokeWidth="1.75"
                    strokeDasharray="3 3"
                    opacity="0.9"
                  />
                  {/* Center Target Core */}
                  <circle cx="24" cy="23" r="3" fill="#f59e0b" />
                  {/* Target Crosshairs */}
                  <path
                    d="M24 11V15.5M24 30.5V35M12 23H16.5M31.5 23H36"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Amber badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.15)]">
              <span className="inline-block size-2 rounded-full bg-amber-500 animate-pulse-dot" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-400 font-medium">
                v2.0 — Telemetry Live
              </span>
            </div>

            {/* Cinematic Typography */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.08]">
              Vulnerability Verification{' '}
              <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                &amp;
              </span>{' '}
              Posture Auditing
            </h1>

            {/* Sub-description */}
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed font-normal">
              Obsidian is a security auditor for authorized networks. It finds exposed services with Nmap, matches them to known vulnerabilities from{' '}
              <span className="text-amber-400/90 font-medium">NVD</span> and{' '}
              <span className="text-amber-400/90 font-medium">CVE.org</span> with confidence ratings, and shows the results in a dashboard with a security grade and an exportable report.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-amber-500 text-black font-semibold text-sm tracking-wide transition-all hover:bg-amber-400 hover:scale-[1.03] shadow-[0_0_30px_rgba(245,158,11,0.5)]"
              >
                <Terminal className="size-4" />
                Launch Dashboard
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/10 bg-[#0d0d0f] text-slate-300 font-medium text-sm backdrop-blur-sm transition-all hover:border-amber-500/40 hover:text-white hover:bg-[#141418]"
              >
                <ExternalLink className="size-4" />
                Documentation
              </a>
            </div>
          </div>
        </SwarmCursor>
      </div>

      {/* ── Features Section ─────────────────────────────────────── */}
      <section id="features" className="relative z-10 mx-auto max-w-6xl px-6 py-24 bg-[#050505]">
        {/* Section header */}
        <AnimatedContent distance={60} duration={0.8} className="mb-14 text-center">
          <span className="mb-4 inline-block rounded-full border border-white/10 bg-[#0d0d0f] px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Core Capabilities
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Enterprise-Grade Scanning.{' '}
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Zero Friction.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Three integrated engines working in concert — from network
            reconnaissance to CVE verification to compliance auditing.
          </p>
        </AnimatedContent>

        {/* Feature cards grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon
            const accentMap = {
              amber:
                'border-amber-500/20 hover:border-amber-500/40 group-hover:text-amber-400 bg-amber-500/10 text-amber-400 shadow-amber-500/20',
              orange:
                'border-orange-500/20 hover:border-orange-500/40 group-hover:text-orange-400 bg-orange-500/10 text-orange-400 shadow-orange-500/20',
              emerald:
                'border-emerald-500/20 hover:border-emerald-500/40 group-hover:text-emerald-400 bg-emerald-500/10 text-emerald-400 shadow-emerald-500/20',
            } as const
            const a = accentMap[f.accent]
            const borderClass = a.split(' ').slice(0, 2).join(' ')
            const iconBgClass = a.split(' ').slice(4, 6).join(' ')
            const badgeClass = a.split(' ').slice(4, 7).join(' ')

            return (
              <AnimatedContent key={f.title} distance={60} delay={i * 0.12} className="h-full">
                <div
                  className={`group relative h-full overflow-hidden rounded-2xl border bg-[#0a0a0c]/60 p-7 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:bg-[#0d0d10]/70 ${borderClass}`}
                >
                  {/* Subtle radial glow on hover */}
                  <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                  {/* Icon */}
                  <div
                    className={`mb-5 flex size-11 items-center justify-center rounded-xl border border-white/[0.06] ${iconBgClass}`}
                  >
                    <Icon className="size-5" />
                  </div>

                  {/* Badge */}
                  <span
                    className={`mb-3 inline-block rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] ${badgeClass}`}
                  >
                    {f.badge}
                  </span>

                  {/* Title + Description */}
                  <h3 className="mb-2 text-lg font-semibold tracking-tight text-white">
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {f.description}
                  </p>
                </div>
              </AnimatedContent>
            )
          })}
        </div>
      </section>

      {/* ── Metrics Bar ──────────────────────────────────────────── */}
      <section id="metrics" className="relative z-10 border-y border-white/[0.06]">
        <AnimatedContent distance={40} className="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-white/[0.06] md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="px-6 py-10 text-center">
              <div className="font-mono text-3xl font-bold text-white md:text-4xl">
                {s.value}
              </div>
              <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                {s.label}
              </div>
            </div>
          ))}
        </AnimatedContent>
      </section>

      {/* ── How It Works ─────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-24">
        <AnimatedContent distance={60} duration={0.8} className="mb-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Three Steps to{' '}
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Full Posture Clarity
            </span>
          </h2>
        </AnimatedContent>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              step: '01',
              icon: Crosshair,
              title: 'Scope Target',
              desc: 'Enter a target IP and port range. The Nmap engine fingerprints services and maps the attack surface.',
            },
            {
              step: '02',
              icon: Zap,
              title: 'Correlate CVEs',
              desc: 'Service banners are matched against the NVD 2.0 API in real-time, filtered by CVSS severity.',
            },
            {
              step: '03',
              icon: Lock,
              title: 'Audit Posture',
              desc: 'HTTP security headers are graded, TLS certificates inspected, and an executive report is generated.',
            },
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <AnimatedContent key={item.step} distance={60} delay={i * 0.12} className="relative text-center">
                {/* Step number */}
                <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/[0.06]">
                  <Icon className="size-6 text-amber-400" />
                </div>
                <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.25em] text-amber-500/60">
                  Step {item.step}
                </span>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  {item.desc}
                </p>
              </AnimatedContent>
            )
          })}
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-32 pt-8">
        <AnimatedContent distance={50} scale={0.97}>
          <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#0d0d10] to-[#0a0a0c] p-12 text-center shadow-[0_0_80px_-20px_rgba(245,158,11,0.15)] md:p-16">
            {/* Glow accent */}
            <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

            <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              Ready to audit your infrastructure?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-slate-400">
              Start the Python backend, launch the dashboard, and get a
              full security posture report in under 60 seconds.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2.5 rounded-full bg-amber-500 px-7 py-3 text-sm font-semibold text-black shadow-[0_0_40px_-8px_rgba(245,158,11,0.5)] transition-all hover:scale-[1.03] hover:shadow-[0_0_60px_-8px_rgba(245,158,11,0.6)]"
              >
                <Terminal className="size-4" />
                Launch Dashboard
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/report"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-[#0d0d0f] px-7 py-3 text-sm font-medium text-slate-300 transition-all hover:border-amber-500/40 hover:bg-[#141418] hover:text-white"
              >
                View Sample Report
              </Link>
            </div>
          </div>
        </AnimatedContent>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
          <div className="flex items-center gap-2.5 text-sm text-slate-500">
            <Shield className="size-4 text-amber-500/60" />
            <span>Obsidian</span>
          </div>
          <div className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.15em] text-slate-600">
            <Link href="/dashboard" className="transition-colors hover:text-slate-400">
              Dashboard
            </Link>
            <Link href="/report" className="transition-colors hover:text-slate-400">
              Report
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
