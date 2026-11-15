export function formatInt(n: number): string {
  return Math.round(n).toLocaleString('zh-CN')
}

export function formatCurrency(n: number): string {
  return `¥ ${n.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function formatCompact(n: number): string {
  if (Math.abs(n) >= 1_000_000) {
    return `${(n / 1_000_000).toLocaleString('zh-CN', {
      maximumFractionDigits: 2,
    })}M`
  }
  if (Math.abs(n) >= 10_000) {
    return `${(n / 10_000).toLocaleString('zh-CN', {
      maximumFractionDigits: 2,
    })}万`
  }
  return formatInt(n)
}

export function formatByType(
  n: number,
  format: 'int' | 'currency' | 'compact',
): string {
  if (format === 'currency') return formatCurrency(n)
  if (format === 'compact') return formatCompact(n)
  return formatInt(n)
}

export function changePercent(current: number, baseline: number): number {
  if (baseline === 0) return current === 0 ? 0 : 100
  return ((current - baseline) / baseline) * 100
}

export function formatPercent(n: number, digits = 1): string {
  const sign = n > 0 ? '+' : ''
  return `${sign}${n.toFixed(digits)}%`
}

export function formatClock(date: Date): string {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}
