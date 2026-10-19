import {
  type CveFinding,
  type OpenPort,
  type TargetInfo,
} from '@/lib/scan-data'
import { Pill } from '@/components/severity-badge'

export type PortTableProps = {
  target?: TargetInfo
  openPorts?: OpenPort[]
  cveFindings?: CveFinding[]
}

export function PortTable({
  target,
  openPorts = [],
  cveFindings = [],
}: PortTableProps) {
  const hostLabel = target?.ip || target?.host || 'Target Host'
  const metaLabel = [target?.asn, target?.region].filter(Boolean).join(' · ') || 'Network Scope'
  const durationLabel = target?.durationSec != null ? `${target.durationSec}s` : '0s'

  return (
    <section aria-labelledby="ports-heading" className="obsidian-card overflow-hidden">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-white/8 px-6 py-5">
        <div>
          <h2 id="ports-heading" className="text-lg font-bold tracking-tight">
            Open Ports &amp; Services
          </h2>
          <p className="mt-1 font-mono text-xs text-slate-400">
            {hostLabel} · {metaLabel}
          </p>
        </div>
        <Pill>SYN scan · {durationLabel}</Pill>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/8 text-[11px] uppercase tracking-[0.14em] text-slate-500">
              <th scope="col" className="px-6 py-3 font-medium">
                Port
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                State
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Service
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                CPE
              </th>
              <th scope="col" className="px-6 py-3 text-right font-medium">
                CVEs
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/6">
            {openPorts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center font-mono text-sm text-slate-400">
                  No open ports discovered for this scan.
                </td>
              </tr>
            ) : (
              openPorts.map((p) => {
                const count = cveFindings.filter((f) => f.affectedPort === p.port).length
                const cpeDisplay = p.cpe ? p.cpe.replace(/^cpe:(?:2\.3:a:|\/a:)/, '') : 'unmapped'
                return (
                  <tr key={`${p.port}-${p.protocol}`} className="transition-colors hover:bg-white/3">
                    <td className="px-6 py-3.5 font-mono text-white">
                      {p.port}
                      <span className="text-slate-500">/{p.protocol}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Pill tone={p.state === 'open' ? 'emerald' : 'neutral'}>{p.state}</Pill>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-white">{p.product || p.service}</span>{' '}
                      <span className="font-mono text-xs text-slate-400">{p.version}</span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-slate-400">{cpeDisplay}</td>
                    <td className="px-6 py-3.5 text-right font-mono tabular-nums">
                      {count > 0 ? <span className="text-rose-400">{count}</span> : <span className="text-slate-600">0</span>}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
