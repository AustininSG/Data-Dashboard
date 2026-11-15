import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DashboardSnapshot, KpiCode } from '../types'
import { changePercent, formatByType, formatPercent } from '../lib/format'

interface ComparisonChartProps {
  snapshot: DashboardSnapshot
  selected: KpiCode
  onSelect: (id: KpiCode) => void
  theme: 'dark' | 'light'
}

export function ComparisonChart({
  snapshot,
  selected,
  onSelect,
  theme,
}: ComparisonChartProps) {
  const metric = snapshot.kpis.find((k) => k.id === selected)!
  const data = snapshot.hourlyByMetric[selected]
  const isDark = theme === 'dark'

  const todayVal = metric.value
  const ySame = metric.yesterdaySamePeriod
  const yFull = metric.yesterdayFull
  const vsSame = changePercent(todayVal, ySame)
  const vsFull = changePercent(todayVal, yFull)

  const grid = isDark ? '#243049' : '#e2e8f0'
  const tick = isDark ? '#8b9bb8' : '#64748b'
  const tooltipBg = isDark ? '#182338' : '#ffffff'
  const tooltipBorder = isDark ? '#243049' : '#e2e8f0'
  const tooltipText = isDark ? '#e8eef9' : '#0f172a'

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-ops-border dark:bg-ops-surface sm:p-5">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-ops-text">
            今日 vs 昨日 · 24h 对比
          </h2>
          <p className="text-xs text-slate-500 dark:text-ops-muted">
            实线今日 · 虚线昨日 · 可切换全部 KPI
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {snapshot.kpis.map((kpi) => (
          <button
            key={kpi.id}
            type="button"
            onClick={() => onSelect(kpi.id)}
            className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
              selected === kpi.id
                ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-700 dark:text-cyan-300'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 dark:border-ops-border dark:bg-ops-elevated dark:text-ops-muted dark:hover:text-ops-text'
            }`}
          >
            {kpi.name.replace(/^今日/, '')}
            <span className="ml-1 font-mono text-[10px] opacity-70">
              {kpi.code}
              {kpi.codeLabel ? `·${kpi.codeLabel}` : ''}
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
        <div className="h-[300px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={grid} strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="hour"
                tick={{ fill: tick, fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: grid }}
                interval={2}
              />
              <YAxis
                tick={{ fill: tick, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={64}
                tickFormatter={(v) =>
                  formatByType(Number(v), metric.format === 'currency' ? 'compact' : 'compact')
                }
              />
              <Tooltip
                contentStyle={{
                  background: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: 12,
                  color: tooltipText,
                  fontSize: 12,
                }}
                formatter={(value, name) => [
                  formatByType(Number(value), metric.format),
                  name === 'today' ? '今日' : '昨日',
                ]}
                labelFormatter={(label) => `${label}`}
              />
              <Legend
                formatter={(value) => (value === 'today' ? '今日' : '昨日')}
                wrapperStyle={{ fontSize: 12, color: tick }}
              />
              <Line
                type="monotone"
                dataKey="today"
                name="today"
                stroke="#22d3ee"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive
                animationDuration={600}
              />
              <Line
                type="monotone"
                dataKey="yesterday"
                name="yesterday"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
                isAnimationActive
                animationDuration={600}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <aside className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 dark:border-ops-border dark:bg-ops-elevated/60">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-ops-muted">
            对比摘要 · {metric.code}
            {metric.codeLabel ? ` (${metric.codeLabel})` : ''}
          </h3>
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-slate-200 dark:divide-ops-border">
              <tr>
                <th className="py-2.5 pr-2 text-xs font-medium text-slate-500 dark:text-ops-muted">
                  今日
                </th>
                <td className="py-2.5 text-right font-semibold tabular-nums text-slate-900 dark:text-ops-text">
                  {formatByType(todayVal, metric.format)}
                </td>
              </tr>
              <tr>
                <th className="py-2.5 pr-2 text-xs font-medium text-slate-500 dark:text-ops-muted">
                  昨日全天
                </th>
                <td className="py-2.5 text-right tabular-nums text-slate-700 dark:text-ops-text/90">
                  {formatByType(yFull, metric.format)}
                </td>
              </tr>
              <tr>
                <th className="py-2.5 pr-2 text-xs font-medium text-slate-500 dark:text-ops-muted">
                  昨日同时段
                </th>
                <td className="py-2.5 text-right tabular-nums text-slate-700 dark:text-ops-text/90">
                  {formatByType(ySame, metric.format)}
                </td>
              </tr>
              <tr>
                <th className="py-2.5 pr-2 text-xs font-medium text-slate-500 dark:text-ops-muted">
                  vs 同时段
                </th>
                <td
                  className={`py-2.5 text-right font-semibold tabular-nums ${
                    vsSame >= 0
                      ? 'text-emerald-600 dark:text-emerald-300'
                      : 'text-rose-600 dark:text-rose-300'
                  }`}
                >
                  {formatPercent(vsSame)}
                </td>
              </tr>
              <tr>
                <th className="py-2.5 pr-2 text-xs font-medium text-slate-500 dark:text-ops-muted">
                  vs 昨日全天
                </th>
                <td
                  className={`py-2.5 text-right font-semibold tabular-nums ${
                    vsFull >= 0
                      ? 'text-emerald-600 dark:text-emerald-300'
                      : 'text-rose-600 dark:text-rose-300'
                  }`}
                >
                  {formatPercent(vsFull)}
                </td>
              </tr>
            </tbody>
          </table>
        </aside>
      </div>
    </section>
  )
}
