import { cn } from '@/lib/utils'
import type { Severity } from '@/lib/scan-data'

const styles: Record<Severity, string> = {
  critical: 'bg-rose-500/12 text-rose-400 border-rose-500/30 shadow-[0_0_18px_-6px_rgba(244,63,94,0.6)]',
  high: 'bg-orange-500/12 text-orange-400 border-orange-500/30 shadow-[0_0_18px_-6px_rgba(249,115,22,0.6)]',
  medium: 'bg-amber-500/12 text-amber-400 border-amber-500/30 shadow-[0_0_18px_-6px_rgba(245,158,11,0.5)]',
  low: 'bg-emerald-500/12 text-emerald-400 border-emerald-500/30',
  info: 'bg-white/6 text-slate-300 border-white/10',
}

export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em]',
        styles[severity],
        className,
      )}
    >
      {severity}
    </span>
  )
}

export function Pill({
  children,
  tone = 'neutral',
  className,
}: {
  children: React.ReactNode
  tone?: 'neutral' | 'amber' | 'emerald' | 'rose'
  className?: string
}) {
  const tones = {
    neutral: 'border-white/10 bg-white/4 text-slate-300',
    amber: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    rose: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] tracking-wide',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function StatusDot({ tone = 'amber', pulse = true }: { tone?: 'amber' | 'emerald' | 'rose' | 'neutral'; pulse?: boolean }) {
  const color = { amber: 'bg-amber-500', emerald: 'bg-emerald-500', rose: 'bg-rose-500', neutral: 'bg-slate-500' }[tone]
  return (
    <span
      aria-hidden="true"
      className={cn('inline-block size-2 rounded-full', color, pulse && 'animate-pulse-dot')}
    />
  )
}
