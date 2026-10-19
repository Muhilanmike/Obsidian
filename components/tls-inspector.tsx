import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { daysUntil, type TlsInfo } from '@/lib/scan-data'
import { Pill } from '@/components/severity-badge'

export type TlsInspectorProps = {
  tlsInfo?: TlsInfo
}

export function TlsInspector({ tlsInfo }: TlsInspectorProps) {
  if (!tlsInfo || (!tlsInfo.notAfter && (!tlsInfo.protocols || tlsInfo.protocols.length === 0))) {
    return (
      <section aria-labelledby="tls-heading" className="obsidian-card h-full min-w-0 p-6">
        <div className="flex items-center gap-2">
          <Lock className="size-4 text-amber-400" aria-hidden="true" />
          <h2 id="tls-heading" className="text-lg font-bold tracking-tight">
            TLS Inspector
          </h2>
        </div>
        <p className="mt-4 font-mono text-sm text-slate-400">
          No TLS certificate or handshake telemetry available for this target.
        </p>
      </section>
    )
  }

  const notBeforeDate = tlsInfo.notBefore ? new Date(tlsInfo.notBefore) : new Date()
  const notAfterDate = tlsInfo.notAfter || new Date(Date.now() + 60 * 86400000).toISOString()
  const days = Math.max(0, daysUntil(notAfterDate))
  const total = Math.max(1, daysUntil(notAfterDate, notBeforeDate))
  const remainingPct = Math.max(0, Math.min(100, (days / total) * 100))
  const expiryTone = days <= 14 ? 'text-rose-400' : days <= 30 ? 'text-amber-400' : 'text-emerald-400'

  const rows: [string, string][] = [
    ['Subject', tlsInfo.subject || 'CN=' + (tlsInfo.host || 'unknown')],
    ['Issuer', tlsInfo.issuer || 'Unknown Issuer'],
    ['Cipher', tlsInfo.cipher || 'TLS_AES_256_GCM_SHA384'],
    ['Key', tlsInfo.keyType || 'ECDSA P-256'],
  ]

  const protocols = Array.isArray(tlsInfo.protocols) ? tlsInfo.protocols : []
  const sans = Array.isArray(tlsInfo.sans) ? tlsInfo.sans : []

  return (
    <section aria-labelledby="tls-heading" className="obsidian-card h-full min-w-0 p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Lock className="size-4 text-amber-400" aria-hidden="true" />
            <h2 id="tls-heading" className="text-lg font-bold tracking-tight">
              TLS Inspector
            </h2>
          </div>
          <p className="mt-1 font-mono text-xs text-slate-400">{tlsInfo.host || 'unknown'}:443</p>
        </div>
        <Pill tone={tlsInfo.hstsPreload ? 'emerald' : 'neutral'}>HSTS preload</Pill>
      </header>

      <div className="mt-5 rounded-xl border border-white/8 bg-black/40 p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Certificate expires in</span>
          <span className={cn('font-mono text-3xl font-bold tabular-nums', expiryTone)}>
            {days}
            <span className="ml-1 text-sm font-normal text-slate-500">days</span>
          </span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/6">
          <div
            className={cn('h-full rounded-full', days <= 14 ? 'bg-rose-500' : days <= 30 ? 'bg-amber-500' : 'bg-emerald-500')}
            style={{ width: `${remainingPct}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between font-mono text-[10px] text-slate-500">
          <span>{tlsInfo.notBefore ? tlsInfo.notBefore.slice(0, 10) : 'N/A'}</span>
          <span>{tlsInfo.notAfter ? tlsInfo.notAfter.slice(0, 10) : 'N/A'}</span>
        </div>
      </div>

      <dl className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="text-[11px] uppercase tracking-[0.14em] text-slate-500">{k}</dt>
            <dd className="mt-0.5 truncate font-mono text-sm text-white" title={v}>
              {v}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-5">
        <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Protocol matrix</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {protocols.map((p) => (
            <Pill key={p.name} tone={!p.enabled ? 'neutral' : p.healthy ? 'emerald' : 'rose'}>
              {p.name} · {p.enabled ? (p.healthy ? 'enabled' : 'deprecated') : 'disabled'}
            </Pill>
          ))}
          <Pill tone={tlsInfo.ocspStapling ? 'emerald' : 'amber'}>OCSP stapling · {tlsInfo.ocspStapling ? 'on' : 'off'}</Pill>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Subject alternative names</p>
        <ul className="mt-2 space-y-1 font-mono text-xs text-slate-300">
          {sans.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
