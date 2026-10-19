import type { Metadata } from 'next'
import { SiteNav } from '@/components/site-nav'
import { ReportView } from '@/components/report-view'

export const metadata: Metadata = {
  title: 'Export Report — NetSec Obsidian',
  description: 'Executive summary and full technical appendix of the latest security posture scan.',
}

export default function ReportPage() {
  return (
    <div className="amber-glow relative min-h-dvh">
      <SiteNav />
      <ReportView />
    </div>
  )
}
