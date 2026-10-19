'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileDown, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatusDot } from '@/components/severity-badge'

const links = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/report', label: 'Export Report' },
]

export function SiteNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-[100] border-b border-white/8 bg-[#050505]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="flex size-9 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 shadow-[0_0_12px_rgba(245,158,11,0.2)] transition-colors group-hover:border-amber-500/50 group-hover:bg-amber-500/15">
            <Shield className="size-4.5 text-amber-400" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
              NETSEC <span className="text-amber-500 font-normal italic">Obsidian</span>
            </span>
            <span className="mt-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">
              <StatusDot /> Telemetry live
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 rounded-full border border-white/8 bg-white/3 p-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm transition-colors',
                  active ? 'bg-white text-black' : 'text-slate-300 hover:text-white',
                )}
              >
                {l.label}
              </Link>
            )
          })}
        </nav>

        <Link
          href="/report"
          className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition-transform hover:scale-[1.02] hover:shadow-[0_8px_30px_-8px_rgba(245,158,11,0.6)]"
        >
          <FileDown className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Export</span>
        </Link>
      </div>
    </header>
  )
}
