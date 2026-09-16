import { useEffect, useState } from 'react'

const SECOND = 1000

export function useCountdownClock(intervalMs = SECOND): number {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timerId = window.setInterval(() => setNow(Date.now()), intervalMs)

    return () => window.clearInterval(timerId)
  }, [intervalMs])

  return now
}

export function getRemainingMilliseconds(
  expiresAt: string,
  now: number,
): number {
  return Math.max(0, new Date(expiresAt).getTime() - now)
}

export function formatCountdown(remainingMs: number): string {
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / SECOND))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const parts = [minutes, seconds]

  if (hours > 0) parts.unshift(hours)

  return parts.map((part) => part.toString().padStart(2, '0')).join(':')
}
