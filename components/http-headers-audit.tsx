import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  computeHeaderGrade,
  type HeaderCheck,
  type TargetInfo,
} from '@/lib/scan-data'

export type HttpHeadersAuditProps = {
  headerChecks?: HeaderCheck[]
  target?: TargetInfo
}

export function HttpHeadersAudit({
  headerChecks = [],
  target,
}: HttpHeadersAuditProps) {
  const { grade, pct } = computeHeaderGrade(headerChecks)
  const circumference = 2 * Math.PI * 34
  const hostLabel = target?.server || target?.host || 'Target Host'
  const portLabel = target?.port || 443

  return (
    <section aria-labelledby="headers-heading" className="obsidian-card h-full min-w-0 p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 id="headers-heading" className="text-lg font-bold tracking-tight">
            HTTP Security Headers
          </h2>
          <p className="mt-1 font-mono text-xs text-slate-400">
            GET / → 200 · :{portLabel} · {hostLabel}
          </p>
        </div>
        <div className="relative size-20 shrink-0" role="img" aria-label={`Grade ${grade}, ${pct} percent`}>
          <svg viewBox="0 0 80 80" className="size-20 -rotate-90">
            <circle cx="40" cy="40" r="34" className="fill-none stroke-white/8" strokeWidth="5" />
            <circle
              cx="40"
              cy="40"
              r="34"
              className="fill-none stroke-amber-500 transition-[stroke-dashoffset] duration-1000 ease-out"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - pct / 100)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-2xl font-bold leading-none text-amber-400">{grade}</span>
            <span className="mt-0.5 font-mono text-[10px] text-slate-500">{pct}</span>
          </div>
        </div>
      </header>

      {headerChecks.length === 0 ? (
        <p className="mt-5 font-mono text-sm text-slate-400">
          No HTTP security headers inspected for this target.
        </p>
      ) : (
        <ul className="mt-5 divide-y divide-white/6">
        {headerChecks.map((h) => {
          const ok = h.header === 'Server' ? !h.present : h.present
          return (
            <li key={h.header} className="flex items-start gap-3 py-3">
              <span
                className={cn(
                  'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border',
                  ok ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-rose-500/30 bg-rose-500/10 text-rose-400',
                )}
                aria-hidden="true"
              >
                {ok ? <Check className="size-3" /> : <X className="size-3" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <code className="font-mono text-sm text-white">{h.header}</code>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                    {ok ? 'pass' : 'fail'} · {h.weight}pt
                  </span>
                </div>
                {h.value && <p className="mt-0.5 truncate font-mono text-xs text-amber-400/80">{h.value}</p>}
                <p className="mt-0.5 text-xs text-slate-400">{h.recommendation}</p>
              </div>
            </li>
          )
        })}
      </ul>
      )}
    </section>
  )
}
