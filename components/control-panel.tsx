'use client'

import { useState } from 'react'
import { Crosshair, Loader2, RefreshCw, Search, ShieldCheck, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { lookupVulnerabilities, type CveFinding } from '@/lib/scan-data'
import { Pill, SeverityBadge, StatusDot } from '@/components/severity-badge'
import { ObsidianSelect } from '@/components/obsidian-select'

export type ScanPhase = 'idle' | 'scanning' | 'complete'

type Props = {
  phase: ScanPhase
  progress: number
  activeStep: string
  hasReport?: boolean
  onScan: (params: { target: string; ports: string; min_severity: string }) => Promise<void> | void
  onDemoScan?: (severity: string) => Promise<void> | void
  onRefreshReport?: () => Promise<void> | void
  onLookupResult?: (findings: CveFinding[]) => void
}

const inputClass =
  'w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 font-mono text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'

const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-slate-400'

const SEVERITY_OPTIONS = [
  { value: 'NONE', label: 'ALL / NONE' },
  { value: 'LOW', label: 'LOW+' },
  { value: 'MEDIUM', label: 'MEDIUM+' },
  { value: 'HIGH', label: 'HIGH+' },
  { value: 'CRITICAL', label: 'CRITICAL' },
]

export function ControlPanel({
  phase,
  progress,
  activeStep,
  hasReport = false,
  onScan,
  onDemoScan,
  onRefreshReport,
  onLookupResult,
}: Props) {
  // Network Reconnaissance Form State
  const [targetHost, setTargetHost] = useState('')
  const [ports, setPorts] = useState('')
  const [profile, setProfile] = useState<'web' | 'top1000' | 'full' | 'custom'>('custom')
  const [minSeverity, setMinSeverity] = useState('NONE')

  // Version CVE Check Form State
  const [product, setProduct] = useState('')
  const [version, setVersion] = useState('')
  const [lookupSeverity, setLookupSeverity] = useState('NONE')
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [lookupChecked, setLookupChecked] = useState(false)
  const [lookupMatches, setLookupMatches] = useState<CveFinding[]>([])
  const [lookupError, setLookupError] = useState<string | null>(null)

  function handleProfileChange(preset: 'web' | 'top1000' | 'full') {
    setProfile(preset)
    if (preset === 'web') setPorts('80,443,8080')
    if (preset === 'top1000') setPorts('1-1000')
    if (preset === 'full') setPorts('1-65535')
  }

  async function handleLookupSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!product.trim() || !version.trim()) return

    setIsLookingUp(true)
    setLookupError(null)
    setLookupChecked(true)

    try {
      const data: any = await lookupVulnerabilities({
        product: product.trim(),
        version: version.trim(),
        min_severity: lookupSeverity,
      })
      const rawFindings = data?.open_ports || data?.findings || []
      const findingsList: CveFinding[] = Array.isArray(rawFindings) ? rawFindings : []
      setLookupMatches(findingsList)
      if (onLookupResult) {
        onLookupResult(findingsList)
      }
    } catch (err: any) {
      setLookupError(err?.message || 'CVE lookup request failed')
      setLookupMatches([])
    } finally {
      setIsLookingUp(false)
    }
  }

  return (
    <section aria-labelledby="control-heading" className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
      <h2 id="control-heading" className="sr-only">
        Control panel
      </h2>

      {/* Network Reconnaissance Scanner */}
      <form
        className="obsidian-card p-6"
        onSubmit={(e) => {
          e.preventDefault()
          onScan({
            target: targetHost.trim(),
            ports: ports.trim() || '80,443',
            min_severity: minSeverity,
          })
        }}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Crosshair className="size-4 text-amber-400" aria-hidden="true" />
              <h3 className="text-lg font-bold tracking-tight">Network Reconnaissance</h3>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Host discovery, port enumeration, service fingerprinting, and header + TLS audit.
            </p>
          </div>
          <Pill tone={phase === 'scanning' ? 'amber' : phase === 'complete' ? 'emerald' : 'neutral'}>
            <StatusDot tone={phase === 'complete' ? 'emerald' : phase === 'scanning' ? 'amber' : 'neutral'} pulse={phase === 'scanning'} />
            {phase === 'idle' ? 'Ready' : phase === 'scanning' ? 'Scanning' : 'Complete'}
          </Pill>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1.5fr_1.2fr_1fr]">
          <div>
            <label htmlFor="target" className={labelClass}>
              Target Host / IP
            </label>
            <input
              id="target"
              value={targetHost}
              onChange={(e) => setTargetHost(e.target.value)}
              className={inputClass}
              placeholder="127.0.0.1"
              autoComplete="off"
              spellCheck={false}
              required
            />
          </div>

          <div>
            <label htmlFor="ports" className={labelClass}>
              TCP Ports <span className="normal-case tracking-normal text-slate-500">(optional)</span>
            </label>
            <input
              id="ports"
              value={ports}
              onChange={(e) => {
                setPorts(e.target.value)
                setProfile('custom')
              }}
              className={inputClass}
              placeholder="80,443"
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <div>
            <label htmlFor="min-severity" className={labelClass}>
              Min Severity
            </label>
            <ObsidianSelect
              id="min-severity"
              value={minSeverity}
              onChange={setMinSeverity}
              options={SEVERITY_OPTIONS}
            />
          </div>
        </div>

        {/* Quick Port Presets */}
        <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-xs text-slate-400">
          <span className="text-[11px] uppercase tracking-wider text-slate-500">Presets:</span>
          <button
            type="button"
            onClick={() => handleProfileChange('web')}
            className={cn(
              'rounded-lg border px-2.5 py-1 transition-all',
              profile === 'web'
                ? 'border-amber-500/50 bg-amber-500/15 text-amber-400'
                : 'border-white/10 hover:border-white/20 hover:text-white',
            )}
          >
            Web (80,443,8080)
          </button>
          <button
            type="button"
            onClick={() => handleProfileChange('top1000')}
            className={cn(
              'rounded-lg border px-2.5 py-1 transition-all',
              profile === 'top1000'
                ? 'border-amber-500/50 bg-amber-500/15 text-amber-400'
                : 'border-white/10 hover:border-white/20 hover:text-white',
            )}
          >
            Top 1000 (1-1000)
          </button>
          <button
            type="button"
            onClick={() => handleProfileChange('full')}
            className={cn(
              'rounded-lg border px-2.5 py-1 transition-all',
              profile === 'full'
                ? 'border-amber-500/50 bg-amber-500/15 text-amber-400'
                : 'border-white/10 hover:border-white/20 hover:text-white',
            )}
          >
            Full (1-65535)
          </button>
        </div>

        {/* Scan Actions & Progress Bar */}
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400">
              <span>{phase === 'idle' ? 'Awaiting target' : activeStep}</span>
              <span className="tabular-nums text-amber-400">{Math.round(progress)}%</span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Scan progress"
              className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-white/6"
            >
              <div
                className="h-full rounded-full bg-amber-500 transition-[width] duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
              {phase === 'scanning' && (
                <div className="absolute inset-y-0 left-0 w-1/3 animate-scan-line bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onRefreshReport && (
              <button
                type="button"
                disabled={phase === 'scanning'}
                onClick={() => onRefreshReport()}
                title="Fetch latest report from scan_report.json"
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3.5 py-2 text-xs font-medium text-slate-300 transition-all hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                <RefreshCw className="size-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Latest</span>
              </button>
            )}

            {onDemoScan && (
              <button
                type="button"
                disabled={phase === 'scanning'}
                onClick={() => onDemoScan(minSeverity)}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3.5 py-2 text-xs font-semibold text-slate-300 transition-all hover:border-amber-500/40 hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                <Sparkles className="size-3.5 text-amber-400" aria-hidden="true" />
                Demo
              </button>
            )}

            <button
              type="submit"
              disabled={phase === 'scanning' || !targetHost.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black transition-all hover:scale-[1.02] hover:shadow-[0_8px_30px_-8px_rgba(245,158,11,0.7)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {phase === 'scanning' ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Search className="size-4" aria-hidden="true" />
              )}
              {phase === 'scanning' ? 'Running' : hasReport ? 'Rescan' : 'Scan'}
            </button>
          </div>
        </div>
      </form>

      {/* Direct CVE Lookup Form */}
      <form
        className="obsidian-card flex flex-col justify-between p-6"
        onSubmit={handleLookupSubmit}
      >
        <div>
          <div className="mb-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-amber-400" aria-hidden="true" />
              <h3 className="text-lg font-bold tracking-tight">Version CVE Check</h3>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Live CVE &amp; CPE correlation against NVD 2.0 and CVE.org records.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <label htmlFor="product" className={labelClass}>
                Product
              </label>
              <input
                id="product"
                value={product}
                onChange={(e) => {
                  setProduct(e.target.value)
                  setLookupChecked(false)
                }}
                className={inputClass}
                placeholder="Apache HTTP Server"
                spellCheck={false}
                required
              />
            </div>

            <div>
              <label htmlFor="version" className={labelClass}>
                Version
              </label>
              <input
                id="version"
                value={version}
                onChange={(e) => {
                  setVersion(e.target.value)
                  setLookupChecked(false)
                }}
                className={inputClass}
                placeholder="2.4.49"
                spellCheck={false}
                required
              />
            </div>

            <div>
              <label htmlFor="lookup-severity" className={labelClass}>
                Min Severity
              </label>
              <ObsidianSelect
                id="lookup-severity"
                value={lookupSeverity}
                onChange={(next) => {
                  setLookupSeverity(next)
                  setLookupChecked(false)
                }}
                options={SEVERITY_OPTIONS}
              />
            </div>
          </div>

          <p className="mt-3 truncate font-mono text-xs text-slate-500">
            Target query: {product} {version} ({lookupSeverity})
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-4">
          <div className="min-h-6 flex-1 text-sm" aria-live="polite">
            {isLookingUp ? (
              <span className="flex items-center gap-2 text-xs text-amber-400 font-mono">
                <Loader2 className="size-3.5 animate-spin" />
                Querying NVD &amp; CVE.org...
              </span>
            ) : lookupError ? (
              <Pill tone="rose">{lookupError}</Pill>
            ) : lookupChecked ? (
              lookupMatches.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-300 font-mono font-medium">
                    {lookupMatches.length} match{lookupMatches.length > 1 ? 'es' : ''}:
                  </span>
                  {lookupMatches.slice(0, 3).map((m) => (
                    <span key={m.id} className="inline-flex items-center gap-1.5">
                      <code className="font-mono text-xs text-white">{m.id}</code>
                      <SeverityBadge severity={m.severity} />
                    </span>
                  ))}
                  {lookupMatches.length > 3 && (
                    <span className="text-xs text-slate-500 font-mono">
                      +{lookupMatches.length - 3} more
                    </span>
                  )}
                </div>
              ) : (
                <Pill tone="emerald">No known CVEs for this version</Pill>
              )
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isLookingUp || !product.trim() || !version.trim()}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-white/15 bg-white px-5 py-2 text-sm font-semibold text-black transition-all hover:scale-[1.02] hover:border-amber-500 disabled:opacity-50"
          >
            {isLookingUp ? <Loader2 className="size-3.5 animate-spin" /> : null}
            Check CVEs
          </button>
        </div>
      </form>
    </section>
  )
}
