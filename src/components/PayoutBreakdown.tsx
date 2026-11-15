import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { PayoutItem } from '../types'
import { formatCurrency, formatInt } from '../lib/format'
import { AnimatedNumber } from './AnimatedNumber'

const COLORS = [
  '#22d3ee',
  '#14b8a6',
  '#2dd4bf',
  '#38bdf8',
  '#67e8f9',
  '#5eead4',
  '#7dd3fc',
  '#99f6e4',
  '#a5f3fc',
  '#6ee7b7',
  '#86efac',
]

interface PayoutBreakdownProps {
  payouts: PayoutItem[]
  highlight: boolean
  theme: 'dark' | 'light'
}

export function PayoutBreakdown({
  payouts,
  highlight,
  theme,
}: PayoutBreakdownProps) {
  const total = useMemo(
    () => payouts.reduce((a, p) => a + p.amount, 0),
    [payouts],
  )
  const ranked = useMemo(
    () => [...payouts].sort((a, b) => b.amount - a.amount),
    [payouts],
  )
  const isDark = theme === 'dark'
  const tick = isDark ? '#8b9bb8' : '#64748b'
  const tooltipBg = isDark ? '#182338' : '#ffffff'
  const tooltipBorder = isDark ? '#243049' : '#e2e8f0'

  return (
    <section
      id="payout-breakdown"
      className={`scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition dark:border-ops-border dark:bg-ops-surface sm:p-5 ${
        highlight ? 'highlight-pulse ring-2 ring-cyan-400/50' : ''
      }`}
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-ops-text">
            平台发放明细
          </h2>
          <p className="text-xs text-slate-500 dark:text-ops-muted">
            11 项渠道拆分 · 合计 =
            <span className="ml-1 font-semibold tabular-nums text-cyan-700 dark:text-cyan-300">
              {formatCurrency(total)}
            </span>
          </p>
        </div>
      </div>

      <div className="mb-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-ops-border dark:bg-ops-elevated/50">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-ops-muted">
            渠道占比
          </h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ranked}
                  dataKey="amount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={92}
                  paddingAngle={2}
                  isAnimationActive
                  animationDuration={700}
                >
                  {ranked.map((entry, i) => (
                    <Cell
                      key={entry.id}
                      fill={COLORS[i % COLORS.length]}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(value, _name, item) => [
                    formatCurrency(Number(value)),
                    (item?.payload as PayoutItem)?.name ?? '',
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-ops-border dark:bg-ops-elevated/50">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-ops-muted">
            发放排名
          </h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ranked}
                layout="vertical"
                margin={{ top: 4, right: 12, left: 8, bottom: 4 }}
              >
                <XAxis
                  type="number"
                  tick={{ fill: tick, fontSize: 10 }}
                  tickFormatter={(v) => `${(Number(v) / 10000).toFixed(1)}万`}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{ fill: tick, fontSize: 10 }}
                  tickFormatter={(v: string) =>
                    v.replace(/^今日/, '').replace(/发放$/, '')
                  }
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(value) => [formatCurrency(Number(value)), '金额']}
                />
                <Bar
                  dataKey="amount"
                  radius={[0, 6, 6, 0]}
                  isAnimationActive
                  animationDuration={700}
                >
                  {ranked.map((entry, i) => (
                    <Cell key={entry.id} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {payouts.map((item, i) => (
          <article
            key={item.id}
            className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-ops-border dark:bg-ops-elevated/40"
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              <h4 className="truncate text-xs font-medium text-slate-600 dark:text-ops-muted">
                {item.name}
              </h4>
            </div>
            <p className="mb-1 text-lg font-semibold tabular-nums text-slate-900 dark:text-ops-text">
              <AnimatedNumber value={item.amount} format="currency" />
            </p>
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-ops-muted">
              <span className="tabular-nums">{item.percent.toFixed(1)}% of total</span>
              <span className="tabular-nums">{formatInt(item.count)} 笔</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-ops-border/60">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, item.percent)}%`,
                  background: COLORS[i % COLORS.length],
                }}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
