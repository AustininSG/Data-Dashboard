import { ArrowDownRight, ArrowUpRight, ExternalLink } from 'lucide-react'
import type { KpiMetric } from '../types'
import { changePercent, formatPercent } from '../lib/format'
import { AnimatedNumber } from './AnimatedNumber'

interface KpiGridProps {
  kpis: KpiMetric[]
  onViewPayouts: () => void
}

export function KpiGrid({ kpis, onViewPayouts }: KpiGridProps) {
  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-ops-text">
            实时 KPI
          </h2>
          <p className="text-xs text-slate-500 dark:text-ops-muted">
            对比昨日同时段 · Wow
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        {kpis.map((kpi) => {
          const delta = changePercent(kpi.value, kpi.yesterdaySamePeriod)
          const up = delta >= 0
          return (
            <article
              key={kpi.id}
              className="group relative rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-cyan-500/30 dark:border-ops-border dark:bg-ops-surface dark:hover:border-cyan-500/25"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-slate-600 dark:border-ops-border dark:bg-ops-elevated dark:text-ops-muted">
                      {kpi.code}
                    </span>
                    {kpi.codeLabel && (
                      <span className="rounded-md bg-cyan-500/10 px-1.5 py-0.5 text-[10px] font-medium text-cyan-700 dark:text-cyan-300">
                        {kpi.codeLabel}
                      </span>
                    )}
                    {kpi.onlineLed && (
                      <span className="ml-0.5 inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 breathing-led-online" />
                        ONLINE
                      </span>
                    )}
                  </div>
                  <h3 className="truncate text-xs font-medium text-slate-500 dark:text-ops-muted">
                    {kpi.name}
                  </h3>
                </div>

                {kpi.scrollToPayouts && (
                  <button
                    type="button"
                    onClick={onViewPayouts}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-[10px] font-medium text-cyan-700 transition hover:bg-cyan-500/20 dark:text-cyan-300"
                  >
                    查看明细
                    <ExternalLink className="h-3 w-3" />
                  </button>
                )}
              </div>

              <p className="mb-2 text-xl font-semibold tracking-tight text-slate-900 dark:text-ops-text sm:text-2xl">
                <AnimatedNumber value={kpi.value} format={kpi.format} />
              </p>

              <div
                className={`inline-flex items-center gap-1 rounded-lg px-1.5 py-0.5 text-xs font-medium ${
                  up
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : 'bg-rose-500/10 text-rose-700 dark:text-rose-300'
                }`}
              >
                {up ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                )}
                <span className="tabular-nums">{formatPercent(delta)}</span>
                <span className="text-[10px] opacity-70">vs 昨日同时段</span>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
