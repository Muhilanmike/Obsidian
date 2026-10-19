import type { Metadata } from 'next'
import { Dashboard } from '@/components/dashboard'
import { SiteNav } from '@/components/site-nav'

export const metadata: Metadata = {
  title: 'Dashboard — Obsidian',
  description: 'Live vulnerability scanning dashboard with real-time CVE correlation, port auditing, and posture analysis.',
}

export default function DashboardPage() {
  return (
    <div className="amber-glow relative min-h-dvh">
      <div aria-hidden="true" className="grid-fade pointer-events-none absolute inset-x-0 top-0 h-[70vh]" />
      <SiteNav />
      <Dashboard />
    </div>
  )
}
