'use client'

import { useEffect, useState } from 'react'
import { Check, Copy, FileJson, FileText, Printer } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CveFindings } from '@/components/cve-findings'
import { Pill, SeverityBadge, StatusDot } from '@/components/severity-badge'
import {
  computeHeaderGrade,
  fetchReport,
  missingControls,
  type ScanReport,
} from '@/lib/scan-data'
import AnimatedContent from '@/components/AnimatedContent'

type Format = 'pdf' | 'json' | 'markdown'

export function ReportView() {
  const [format, setFormat] = useState<Format>('pdf')
  const [copied, setCopied] = useState(false)
  const [report, setReport] = useState<ScanReport | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReport()
      .then((data) => setReport(data))
      .catch((err) => console.warn('Could not load report for export view:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-20">
        <div className="obsidian-card flex items-center justify-center p-12 text-center">
          <p className="font-mono text-sm text-slate-400">Loading scan report...</p>
        </div>
      </main>
    )
  }

  if (!report) {
    return (
      <main className="mx-auto max-w-7xl px-6 pb-24">
        <AnimatedContent trigger="mount" distance={40} duration={0.7}>
          <section className="pt-14 pb-10 md:pt-20">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="neutral">
                <StatusDot tone="neutral" pulse={false} /> No Report
              </Pill>
            </div>
            <h1 className="text-hero mt-5 max-w-3xl text-balance">Export Report</h1>
            <p className="mt-4 max-w-2xl text-pretty text-base text-slate-400 md:text-lg">
              No scan has been generated yet. Run a network reconnaissance scan or try the demo from the dashboard to review and export reports.
            </p>
          </section>
        </AnimatedContent>

        <div className="obsidian-card flex flex-col items-center justify-center p-12 text-center animate-rise">
          <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/4">
            <FileText className="size-6 text-amber-400" />
          </div>
          <h3 className="mt-4 text-lg font-bold tracking-tight text-white">No scan yet</h3>
          <p className="mt-2 max-w-md text-sm text-slate-400">
            A scan report is required to generate executive summaries and technical remediation notes.
          </p>
          <a
            href="/dashboard"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black transition-all hover:scale-[1.02] hover:shadow-[0_8px_30px_-8px_rgba(245,158,11,0.7)]"
          >
            Go to Dashboard
          </a>
        </div>
      </main>
    )
  }

  const { target, openPorts = [], cveFindings = [], headerChecks = [], tlsInfo } = report
  const { grade, pct } = computeHeaderGrade(headerChecks)
  const missing = missingControls(headerChecks)
  const notAfterDate = tlsInfo?.notAfter || new Date(Date.now() + 60 * 86400000).toISOString()
  const expiry = Math.max(0, Math.ceil((new Date(notAfterDate).getTime() - Date.now()) / 86400000))
  const protocols = Array.isArray(tlsInfo?.protocols) ? tlsInfo.protocols : []

  const payload = {
    scanId: target.scanId,
    target: { host: target.host, ip: target.ip, asn: target.asn },
    startedAt: target.startedAt,
    grade,
    headerScore: pct,
    openPorts: openPorts.filter((p) => p.state === 'open').map((p) => p.port),
    findings: cveFindings.map((f) => ({ id: f.id, cvss: f.cvss, severity: f.severity, port: f.affectedPort })),
    tls: { expiresInDays: expiry, deprecatedProtocols: protocols.filter((p) => p.enabled && !p.healthy).map((p) => p.name) },
  }

  async function copyJson() {
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const formats: { id: Format; label: string; icon: typeof FileText; hint: string }[] = [
    { id: 'pdf', label: 'PDF', icon: FileText, hint: 'Executive summary + appendix' },
    { id: 'json', label: 'JSON', icon: FileJson, hint: 'Machine-readable, SARIF-adjacent' },
    { id: 'markdown', label: 'Markdown', icon: Printer, hint: 'Ticket-ready remediation notes' },
  ]

  return (
    <main className="mx-auto max-w-7xl px-6 pb-24">
      <AnimatedContent trigger="mount" distance={40} duration={0.7}>
        <section className="pt-14 pb-10 md:pt-20">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="amber">
              <StatusDot pulse={false} /> {target.scanId}
            </Pill>
            <Pill>Classification: Internal</Pill>
          </div>
          <h1 className="text-hero mt-5 max-w-3xl text-balance">Export Report</h1>
          <p className="mt-4 max-w-2xl text-pretty text-base text-slate-400 md:text-lg">
            Executive summary and full technical appendix for <code className="font-mono text-sm text-white">{target.host}</code>.
            Choose a format, review the summary, then export.
          </p>
        </section>
      </AnimatedContent>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="obsidian-card animate-rise h-fit p-6 lg:sticky lg:top-24">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Format</p>
          <div role="radiogroup" aria-label="Export format" className="mt-3 space-y-2">
            {formats.map((f) => {
              const active = format === f.id
              return (
                <button
                  key={f.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setFormat(f.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all hover:scale-[1.01]',
                    active ? 'border-amber-500/50 bg-amber-500/8' : 'border-white/8 bg-black/30 hover:border-white/20',
                  )}
                >
                  <f.icon className={cn('size-4', active ? 'text-amber-400' : 'text-slate-500')} aria-hidden="true" />
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-white">{f.label}</span>
                    <span className="block text-xs text-slate-400">{f.hint}</span>
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-6 space-y-2">
            <button
              type="button"
              onClick={() => (format === 'json' ? copyJson() : window.print())}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black transition-all hover:scale-[1.02] hover:shadow-[0_8px_30px_-8px_rgba(245,158,11,0.7)]"
            >
              {format === 'json' ? (
                copied ? (
                  <Check className="size-4" aria-hidden="true" />
                ) : (
                  <Copy className="size-4" aria-hidden="true" />
                )
              ) : (
                <Printer className="size-4" aria-hidden="true" />
              )}
              {format === 'json' ? (copied ? 'Copied to clipboard' : 'Copy JSON') : `Export ${format.toUpperCase()}`}
            </button>
            <p className="text-center font-mono text-[11px] text-slate-500">
              {format === 'json' ? `${JSON.stringify(payload).length} bytes` : 'Opens the print dialog'}
            </p>
          </div>

          <dl className="mt-6 space-y-2 border-t border-white/8 pt-5 font-mono text-xs">
            <div className="flex justify-between">
              <dt className="text-slate-500">Generated</dt>
              <dd className="text-slate-300">2026-10-15 09:34 UTC</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Analyst</dt>
              <dd className="text-slate-300">secops-automation</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Data sources</dt>
              <dd className="text-slate-300">NVD 2.0 · CVE.org</dd>
            </div>
          </dl>
        </aside>

        <div className="space-y-6">
          <AnimatedContent trigger="mount" distance={40} delay={0.1}>
            <section aria-labelledby="exec-heading" className="obsidian-card p-6">
              <h2 id="exec-heading" className="text-2xl font-bold tracking-tight">
                Executive Summary
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <Stat label="Overall grade" value={grade} tone="text-amber-400" sub={`${pct}/100`} />
                <Stat
                  label="Critical findings"
                  value={String(cveFindings.filter((f) => f.severity === 'critical').length)}
                  tone="text-rose-400"
                  sub="requires 72h SLA"
                />
                <Stat label="TLS expiry" value={`${expiry}d`} tone={expiry <= 30 ? 'text-amber-400' : 'text-emerald-400'} sub={tlsInfo?.notAfter ? tlsInfo.notAfter.slice(0, 10) : 'N/A'} />
              </div>
              <p className="mt-6 text-sm leading-relaxed text-slate-300">
                The external attack surface of <code className="font-mono text-white">{target.host || 'the target'}</code> exposes{' '}
                {openPorts.filter((p) => p.state === 'open').length} services.{' '}
                {cveFindings[0] ? (
                  <>
                    Primary finding (<code className="font-mono text-white">{cveFindings[0].id}</code>) is categorized under{' '}
                    <span className="font-semibold text-rose-400">{cveFindings[0].severity}</span> severity and should be remediated by upgrading to{' '}
                    <code className="font-mono text-emerald-400">{cveFindings[0].fixVersion}</code>.
                  </>
                ) : (
                  'No critical CVE vulnerabilities were identified across fingerprinted services.'
                )}{' '}
                HTTP control coverage is graded <strong className="text-white">{grade}</strong> with {missing.length} missing or misconfigured headers.
              </p>
            </section>
          </AnimatedContent>

          <AnimatedContent trigger="mount" distance={40} delay={0.2}>
            <section aria-labelledby="remediation-heading" className="obsidian-card p-6">
              <h2 id="remediation-heading" className="text-2xl font-bold tracking-tight">
                Prioritized Remediation
              </h2>
              <ol className="mt-5 divide-y divide-white/6">
                {cveFindings.slice(0, 3).map((f, i) => (
                  <li key={f.id} className="flex items-start gap-4 py-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 font-mono text-sm text-slate-300">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <code className="font-mono font-semibold text-white">{f.id}</code>
                        <SeverityBadge severity={f.severity} />
                        <span className="font-mono text-xs text-slate-400">:{f.affectedPort}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-400">
                        Upgrade <span className="font-mono text-slate-300">{f.cpe.split(':').slice(3, 5).join('/')}</span> from{' '}
                        <span className="font-mono text-rose-400">{f.cpe.split(':')[5]}</span> to{' '}
                        <span className="font-mono text-emerald-400">{f.fixVersion}</span> or later.
                      </p>
                    </div>
                  </li>
                ))}
                {missing.map((h, i) => (
                  <li key={h.header} className="flex items-start gap-4 py-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 font-mono text-sm text-slate-300">
                      {i + 4}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <code className="font-mono font-semibold text-white">{h.header}</code>
                        <SeverityBadge severity={h.weight >= 20 ? 'high' : 'medium'} />
                      </div>
                      <p className="mt-1 text-sm text-slate-400">{h.recommendation}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </AnimatedContent>

          <CveFindings compact findings={cveFindings} />
        </div>
      </div>
    </main>
  )
}

function Stat({ label, value, sub, tone }: { label: string; value: string; sub: string; tone: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/40 p-4">
      <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className={cn('mt-2 font-mono text-3xl font-bold tabular-nums', tone)}>{value}</p>
      <p className="mt-1 font-mono text-xs text-slate-500">{sub}</p>
    </div>
  )
}
