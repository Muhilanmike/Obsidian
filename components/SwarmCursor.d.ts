import type { CSSProperties, FC, ReactNode } from 'react'

export interface SwarmCursorProps {
  count?: number
  size?: number
  shape?: 'dot' | 'square' | 'streak'
  color?: string
  accentColor?: string
  spread?: number
  speed?: number
  swirl?: number
  tail?: number
  trail?: number
  wander?: number
  depth?: number
  targets?: string
  idle?: 'roam' | 'gather' | 'hide'
  clickEffect?: 'burst' | 'pulse' | 'none'
  hideCursor?: boolean
  intro?: boolean
  enabled?: boolean
  lightMode?: boolean
  dpr?: number
  children?: ReactNode
  className?: string
  style?: CSSProperties
  [key: string]: any
}

declare const SwarmCursor: FC<SwarmCursorProps>
export default SwarmCursor
