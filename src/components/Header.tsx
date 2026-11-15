import {
  Moon,
  RefreshCw,
  Sun,
  Radio,
} from 'lucide-react'
import { formatClock } from '../lib/format'
import { TIME_FILTER_LABELS } from '../data/mockData'
import type { TimeFilter } from '../types'

interface HeaderProps {
  now: Date
  theme: 'dark' | 'light'
  timeFilter: TimeFilter
  simulateLive: boolean
  refreshing: boolean
  onToggleTheme: () => void
  onTimeFilter: (f: TimeFilter) => void
  onRefresh: () => void
  onToggleSimulate: () => void
}

export function Header({
  now,
  theme,
  timeFilter,
  simulateLive,
  refreshing,
  onToggleTheme,
  onTimeFilter,
  onRefresh,
  onToggleSimulate,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-ops-border/80 dark:bg-[#0b1220]/75">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 shadow-lg shadow-cyan-500/20">
              <Radio className="h-4.5 w-4.5 text-slate-950" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-ops-text sm:text-xl">
                实时数据系统
              </h1>
              <p className="hidden text-xs text-slate-500 dark:text-ops-muted sm:block">
                Real-time Operations Console
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 breathing-led" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            实时监控中
          </div>

          <time className="font-mono text-xs tabular-nums text-slate-500 dark:text-ops-muted sm:text-sm">
            {formatClock(now)}
          </time>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100/80 p-0.5 dark:border-ops-border dark:bg-ops-elevated/80">
            {(Object.keys(TIME_FILTER_LABELS) as TimeFilter[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => onTimeFilter(key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                  timeFilter === key
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-ops-surface dark:text-ops-text'
                    : 'text-slate-500 hover:text-slate-800 dark:text-ops-muted dark:hover:text-ops-text'
                }`}
              >
                {TIME_FILTER_LABELS[key]}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-ops-border dark:bg-ops-surface dark:text-ops-text dark:hover:bg-ops-elevated sm:text-sm"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`}
            />
            刷新
          </button>

          <button
            type="button"
            onClick={onToggleSimulate}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium shadow-sm transition sm:text-sm ${
              simulateLive
                ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-700 dark:text-cyan-300'
                : 'border-slate-200 bg-white text-slate-700 dark:border-ops-border dark:bg-ops-surface dark:text-ops-muted'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                simulateLive
                  ? 'bg-cyan-400 breathing-led'
                  : 'bg-slate-400 dark:bg-slate-600'
              }`}
            />
            模拟实时推送
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="切换主题"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-ops-border dark:bg-ops-surface dark:text-ops-text dark:hover:bg-ops-elevated"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
