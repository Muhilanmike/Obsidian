import { Activity, AlertTriangle, Network, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import AnimatedContent from '@/components/AnimatedContent'
import {
  computeHeaderGrade,
  missingControls,
  type CveFinding,
  type HeaderCheck,
  type OpenPort,
} from '@/lib/scan-data'

export type KpiRowProps = {
  revealed?: boolean
  openPorts?: OpenPort[]
  cveFindings?: CveFinding[]
  headerChecks?: HeaderCheck[]
}

export function KpiRow({
  revealed = true,
  openPorts = [],
  cveFindings = [],
  headerChecks = [],
}: KpiRowProps) {
  const { grade, pct } = computeHeaderGrade(headerChecks)
  const open = openPorts.filter((p) => p.state === 'open').length
  const critical = cveFindings.filter((f) => f.severity === 'critical').length
  const missing = missingControls(headerChecks).length

  const items = [
    {
      label: 'Security grade',
      value: grade,
      sub: `${pct}/100 header score`,
      icon: ShieldAlert,
      tone: grade === 'A' || grade === 'B' ? 'text-emerald-400' : grade === 'C' ? 'text-amber-400' : 'text-rose-400',
    },
    {
      label: 'Open ports',
      value: String(open).padStart(2, '0'),
      sub: `${openPorts.length - open} filtered · ${openPorts.length} fingerprinted`,
      icon: Network,
      tone: 'text-white',
    },
    {
      label: 'Matched CVEs',
      value: String(cveFindings.length).padStart(2, '0'),
      sub: `${critical} critical · ${cveFindings.filter((f) => f.kev).length} in CISA KEV`,
      icon: AlertTriangle,
      tone: 'text-rose-400',
    },
    {
      label: 'Missing HTTP controls',
      value: String(missing).padStart(2, '0'),
      sub: `of ${headerChecks.length} inspected headers`,
      icon: Activity,
      tone: 'text-amber-400',
    },
  ]

  return (
    <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, i) => (
        <AnimatedContent key={item.label} trigger="mount" distance={40} delay={i * 0.08} className="h-full">
          <article className="obsidian-card obsidian-card-hover h-full p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">{item.label}</p>
              <item.icon className="size-4 text-slate-500" aria-hidden="true" />
            </div>
            <p className={cn('mt-3 font-mono text-4xl font-bold tabular-nums tracking-tight', item.tone)}>
              {revealed ? item.value : '--'}
            </p>
            <p className="mt-2 font-mono text-xs text-slate-500">{item.sub}</p>
          </article>
        </AnimatedContent>
      ))}
    </section>
  )
}
