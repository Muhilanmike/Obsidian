'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Crosshair, ShieldCheck, Wifi, WifiOff } from 'lucide-react'
import { ControlPanel, type ScanPhase } from '@/components/control-panel'
import AnimatedContent from '@/components/AnimatedContent'
import { CveFindings } from '@/components/cve-findings'
import { HttpHeadersAudit } from '@/components/http-headers-audit'
import { KpiRow } from '@/components/kpi-row'
import { PortTable } from '@/components/port-table'
import { Pill, StatusDot } from '@/components/severity-badge'
import { TlsInspector } from '@/components/tls-inspector'
import {
  fetchDemoReport,
  fetchReport,
  scanTimeline,
  triggerScan,
  type CveFinding,
  type ScanReport,
} from '@/lib/scan-data'

const STEP_DURATION_MS = 380

export function Dashboard() {
  const [phase, setPhase] = useState<ScanPhase>('idle')
  const [progress, setProgress] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [report, setReport] = useState<ScanReport | null>(null)
  const [lookupFindings, setLookupFindings] = useState<CveFinding[]>([])
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successNotice, setSuccessNotice] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  // Check backend connectivity on mount without loading any report data
  useEffect(() => {
    let isMounted = true

    async function checkBackend() {
      try {
        await fetch('/api/report', { method: 'GET', cache: 'no-store' })
        if (isMounted) {
          setBackendConnected(true)
        }
      } catch {
        if (isMounted) {
          setBackendConnected(false)
        }
      }
    }

    checkBackend()

    return () => {
      isMounted = false
      if (timer.current) clearInterval(timer.current)
    }
  }, [])

  function startProgressAnimation(onComplete?: () => void) {
    if (timer.current) clearInterval(timer.current)
    setPhase('scanning')
    setProgress(5)
    setStepIndex(0)

    let tick = 1
    const totalTicks = scanTimeline.length * 4
    timer.current = setInterval(() => {
      tick += 1
      const pct = Math.min(95, (tick / totalTicks) * 100)
      setProgress(pct)
      setStepIndex(Math.min(scanTimeline.length - 1, Math.floor(tick / 4)))
    }, STEP_DURATION_MS / 4)
  }

  function stopProgressAnimation(success = true) {
    if (timer.current) {
      clearInterval(timer.current)
      timer.current = null
    }
    setProgress(100)
    setStepIndex(scanTimeline.length - 1)
    setPhase('complete')
  }

  // Active Network Scan handler
  async function handleScan(params: { target: string; ports: string; min_severity: string }) {
    setErrorMessage(null)
    setSuccessNotice(null)
    startProgressAnimation()

    try {
      const liveReport = await triggerScan(params)
      setReport(liveReport)
      setBackendConnected(true)
      setSuccessNotice(`Scan completed for ${params.target} (${liveReport.openPorts.length} active ports discovered)`)
      setTimeout(() => setSuccessNotice(null), 4000)
    } catch (err: any) {
      console.error('Scan execution error:', err)
      setErrorMessage(err?.message || 'Network scan failed to complete.')
    } finally {
      stopProgressAnimation()
    }
  }

  // Demo Scan handler
  async function handleDemoScan(severity: string) {
    setErrorMessage(null)
    setSuccessNotice(null)
    startProgressAnimation()

    try {
      const demoData = await fetchDemoReport(severity)
      setReport(demoData)
      setBackendConnected(true)
      setSuccessNotice(`Demo scan report loaded (Filter: ${severity})`)
      setTimeout(() => setSuccessNotice(null), 4000)
    } catch (err: any) {
      console.error('Demo scan error:', err)
      setErrorMessage(err?.message || 'Failed to generate demo scan report.')
    } finally {
      stopProgressAnimation()
    }
  }

  // Refresh latest report handler
  async function handleRefreshReport() {
    setErrorMessage(null)
    setSuccessNotice(null)
    try {
      const latest = await fetchReport()
      if (!latest) {
        setSuccessNotice('No saved report yet. Run a scan first.')
        setTimeout(() => setSuccessNotice(null), 3500)
        return
      }
      setReport(latest)
      setPhase('complete')
      setProgress(100)
      setStepIndex(scanTimeline.length - 1)
      setBackendConnected(true)
      setSuccessNotice('Updated to latest report from scan_report.json')
      setTimeout(() => setSuccessNotice(null), 3000)
    } catch (err: any) {
      setErrorMessage(err?.message || 'Could not fetch latest report from backend.')
    }
  }

  // Direct CVE lookup callback
  function handleLookupResult(dataOrFindings: any) {
    const rawFindings = dataOrFindings?.open_ports || dataOrFindings?.findings || (Array.isArray(dataOrFindings) ? dataOrFindings : [])
    setLookupFindings(Array.isArray(rawFindings) ? rawFindings : [])
  }

  // Merge report findings with any direct lookup findings that aren't duplicates
  const allFindings = useMemo(() => {
    const existing = report?.cveFindings || []
    if (lookupFindings.length === 0) return existing

    const map = new Map<string, CveFinding>()
    for (const f of lookupFindings) {
      map.set(f.id, f)
    }
    for (const f of existing) {
      if (!map.has(f.id)) {
        map.set(f.id, f)
      }
    }
    return Array.from(map.values())
  }, [report?.cveFindings, lookupFindings])

  const activeStep = scanTimeline[stepIndex]?.label ?? ''

  return (
    <main className="relative mx-auto max-w-7xl px-6 pb-24">
      {/* Top Notification Banners */}
      {errorMessage && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-xs font-mono text-rose-400 underline hover:text-rose-200"
          >
            Dismiss
          </button>
        </div>
      )}

      {successNotice && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          <CheckCircle2 className="size-4 text-emerald-400" />
          <span>{successNotice}</span>
        </div>
      )}

      <AnimatedContent trigger="mount" distance={40} duration={0.7}>
        <section className="pt-14 pb-10 md:pt-20">
          <div className="flex flex-wrap items-center gap-2">
            {report?.target?.scanId ? (
              <Pill tone="amber">
                <StatusDot tone="amber" pulse={phase === 'scanning'} /> {report.target.scanId}
              </Pill>
            ) : (
              <Pill tone="neutral">
                <StatusDot tone="neutral" pulse={false} /> Ready
              </Pill>
            )}
            {report?.target?.startedAt ? (
              <Pill>
                {report.target.startedAt.replace('T', ' ').slice(0, 19)} UTC
              </Pill>
            ) : null}
            <Pill tone={backendConnected ? 'emerald' : backendConnected === false ? 'amber' : 'neutral'}>
              {backendConnected ? (
                <span className="inline-flex items-center gap-1.5">
                  <Wifi className="size-3 text-emerald-400" /> Backend Online (8080)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  <WifiOff className="size-3 text-amber-400" /> Backend Offline
                </span>
              )}
            </Pill>
          </div>

          <h1 className="text-hero mt-5 max-w-3xl text-balance">
            Security posture, <span className="text-amber-400">verified</span> against the record.
          </h1>
          {report?.target?.host ? (
            <p className="mt-4 max-w-2xl text-pretty text-base text-slate-400 md:text-lg">
              Live reconnaissance of <code className="font-mono text-sm text-white">{report.target.host}</code> with CPE-correlated
              CVE matching, HTTP control grading, and TLS chain inspection — framed for the analyst, not the alert queue.
            </p>
          ) : (
            <p className="mt-4 max-w-2xl text-pretty text-base text-slate-400 md:text-lg">
              Enter a target to begin reconnaissance with CPE-correlated CVE matching, HTTP control grading, and TLS chain inspection.
            </p>
          )}
        </section>
      </AnimatedContent>

      <div className="space-y-6">
        <AnimatedContent trigger="mount" distance={40} delay={0.1}>
          <ControlPanel
            phase={phase}
            progress={progress}
            activeStep={activeStep}
            hasReport={Boolean(report)}
            onScan={handleScan}
            onDemoScan={handleDemoScan}
            onRefreshReport={handleRefreshReport}
            onLookupResult={handleLookupResult}
          />
        </AnimatedContent>

        {phase === 'scanning' ? (
          <ScanTimeline stepIndex={stepIndex} />
        ) : report ? (
          <>
            <KpiRow
              key={`kpi-${report.target.startedAt}`}
              revealed
              openPorts={report.openPorts || []}
              cveFindings={allFindings}
              headerChecks={report.headerChecks || []}
            />

            <AnimatedContent key={`ports-${report.target.startedAt}`} trigger="mount" distance={40} delay={0.1}>
              <PortTable
                target={report.target}
                openPorts={report.openPorts || []}
                cveFindings={allFindings}
              />
            </AnimatedContent>

            <div className="grid gap-6 lg:grid-cols-2">
              <AnimatedContent key={`headers-${report.target.startedAt}`} trigger="mount" distance={40} delay={0.2} className="h-full min-w-0">
                <HttpHeadersAudit
                  headerChecks={report.headerChecks || []}
                  target={report.target}
                />
              </AnimatedContent>
              <AnimatedContent key={`tls-${report.target.startedAt}`} trigger="mount" distance={40} delay={0.3} className="h-full min-w-0">
                <TlsInspector
                  tlsInfo={report.tlsInfo}
                />
              </AnimatedContent>
            </div>

            <AnimatedContent key={`cves-${report.target.startedAt}`} trigger="mount" distance={40} delay={0.4}>
              <CveFindings
                findings={allFindings}
              />
            </AnimatedContent>
          </>
        ) : lookupFindings.length > 0 ? (
          <div className="space-y-6">
            <div className="obsidian-card p-6">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="size-5 text-amber-400" />
                <h3 className="text-lg font-bold tracking-tight">Direct CVE Lookup Results</h3>
              </div>
              <p className="text-sm text-slate-400">
                Displaying standalone CVE query findings. Run a network reconnaissance scan above to generate full port and TLS telemetry.
              </p>
            </div>
            <AnimatedContent trigger="mount" distance={40}>
              <CveFindings findings={lookupFindings} />
            </AnimatedContent>
          </div>
        ) : (
          <div className="obsidian-card flex flex-col items-center justify-center p-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/4">
              <Crosshair className="size-6 text-amber-400" />
            </div>
            <h3 className="mt-4 text-lg font-bold tracking-tight text-white">No scan yet</h3>
            <p className="mt-2 max-w-md text-sm text-slate-400">
              Enter a target host above and click <span className="font-semibold text-white">Scan</span> to begin live reconnaissance, or try the <span className="font-semibold text-amber-400">Demo</span> button.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

function ScanTimeline({ stepIndex }: { stepIndex: number }) {
  return (
    <section aria-live="polite" className="obsidian-card p-6">
      <h2 className="text-lg font-bold tracking-tight">Pipeline</h2>
      <ol className="mt-4 grid gap-3 md:grid-cols-2">
        {scanTimeline.map((s, i) => {
          const done = i < stepIndex
          const active = i === stepIndex
          return (
            <li
              key={s.label}
              className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
                active ? 'border-amber-500/40 bg-amber-500/5' : done ? 'border-emerald-500/20' : 'border-white/8 opacity-50'
              }`}
            >
              <StatusDot tone={done ? 'emerald' : 'amber'} pulse={active} />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white">{s.label}</p>
                <p className="truncate font-mono text-xs text-slate-500">{s.detail}</p>
              </div>
              <span className="font-mono text-xs tabular-nums text-slate-400">{(s.ms / 1000).toFixed(1)}s</span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
