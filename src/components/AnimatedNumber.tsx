import { useEffect, useRef, useState } from 'react'
import { formatByType } from '../lib/format'

interface AnimatedNumberProps {
  value: number
  format?: 'int' | 'currency' | 'compact'
  className?: string
  duration?: number
}

export function AnimatedNumber({
  value,
  format = 'int',
  className = '',
  duration = 450,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    const from = fromRef.current
    const to = value
    if (from === to) {
      setDisplay(to)
      return
    }

    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const current = from + (to - from) * eased
      setDisplay(current)
      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        fromRef.current = to
        setDisplay(to)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [value, duration])

  return (
    <span className={`tabular-nums number-roll ${className}`}>
      {formatByType(display, format)}
    </span>
  )
}
