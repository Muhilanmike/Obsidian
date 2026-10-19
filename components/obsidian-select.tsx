'use client'

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ObsidianSelectOption = { value: string; label: string }

type Props = {
  id?: string
  value: string
  onChange: (value: string) => void
  options: ObsidianSelectOption[]
  className?: string
}

/**
 * Themed replacement for the native <select>. The native popup is drawn by the
 * OS/browser and cannot be styled, so this renders its own listbox.
 * Supports mouse, keyboard (Arrow keys, Home/End, Enter/Space, Escape, Tab)
 * and closes when clicking outside.
 *
 * The list is rendered in a portal on document.body with fixed positioning.
 * The cards use backdrop-blur (which creates a stacking context), so a normal
 * absolutely-positioned list would be covered by the cards below it.
 */
export function ObsidianSelect({ id, value, onChange, options, className }: Props) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [pos, setPos] = useState<CSSProperties | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const listId = useId()

  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  )
  const selected = options[selectedIndex]

  // Position the list under (or above, if there is no room) the button.
  useLayoutEffect(() => {
    if (!open) return
    function measure() {
      const rect = buttonRef.current?.getBoundingClientRect()
      if (!rect) return
      const listHeight = options.length * 36 + 12
      const spaceBelow = window.innerHeight - rect.bottom
      const openUp = spaceBelow < listHeight + 16 && rect.top > spaceBelow
      setPos({
        position: 'fixed',
        left: rect.left,
        width: rect.width,
        ...(openUp
          ? { bottom: window.innerHeight - rect.top + 8 }
          : { top: rect.bottom + 8 }),
      })
    }
    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
    }
  }, [open, options.length])

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: MouseEvent) {
      const target = e.target as Node
      if (rootRef.current?.contains(target) || listRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  function openList() {
    setActive(selectedIndex)
    setPos(null)
    setOpen(true)
  }

  function choose(index: number) {
    onChange(options[index].value)
    setOpen(false)
    buttonRef.current?.focus()
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (!open) openList()
        else setActive((a) => Math.min(a + 1, options.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        if (!open) openList()
        else setActive((a) => Math.max(a - 1, 0))
        break
      case 'Home':
        if (open) {
          e.preventDefault()
          setActive(0)
        }
        break
      case 'End':
        if (open) {
          e.preventDefault()
          setActive(options.length - 1)
        }
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (!open) openList()
        else choose(active)
        break
      case 'Escape':
        if (open) {
          e.preventDefault()
          setOpen(false)
        }
        break
      case 'Tab':
        setOpen(false)
        break
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-left font-mono text-sm text-white outline-none transition-colors',
          'hover:border-white/20 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20',
          open && 'border-amber-500 ring-2 ring-amber-500/20',
          className,
        )}
      >
        <span className="truncate">{selected?.label}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn('size-4 shrink-0 text-slate-400 transition-transform duration-200', open && 'rotate-180 text-amber-400')}
        />
      </button>

      {open &&
        pos &&
        createPortal(
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          style={{ ...pos, zIndex: 60 }}
          className="overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0c] p-1 shadow-[0_16px_48px_rgba(0,0,0,0.7),0_0_24px_rgba(245,158,11,0.08)]"
        >
          {options.map((option, i) => {
            const isSelected = option.value === value
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(i)}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 font-mono text-sm transition-colors',
                  i === active ? 'bg-amber-500/10 text-amber-300' : 'text-slate-300',
                  isSelected && 'text-amber-400',
                )}
              >
                <span>{option.label}</span>
                {isSelected && <Check aria-hidden="true" className="size-4 text-amber-400" />}
              </li>
            )
          })}
        </ul>,
        document.body,
      )}
    </div>
  )
}
