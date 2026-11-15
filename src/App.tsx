import { useCallback, useEffect, useState } from 'react'
import { Header } from './components/Header'
import { SystemTotals } from './components/SystemTotals'
import { KpiGrid } from './components/KpiGrid'
import { ComparisonChart } from './components/ComparisonChart'
import { PayoutBreakdown } from './components/PayoutBreakdown'
import { createInitialSnapshot, nudgeSnapshot } from './data/mockData'
import type { DashboardSnapshot, KpiCode, TimeFilter } from './types'

function applyTheme(theme: 'dark' | 'light') {
  const root = document.documentElement
  if (theme === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
}

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('ops-theme') as 'dark' | 'light' | null
    return saved ?? 'dark'
  })
  const [now, setNow] = useState(() => new Date())
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('today')
  const [simulateLive, setSimulateLive] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [snapshot, setSnapshot] = useState<DashboardSnapshot>(() =>
    createInitialSnapshot(),
  )
  const [selectedMetric, setSelectedMetric] = useState<KpiCode>('CN')
  const [payoutHighlight, setPayoutHighlight] = useState(false)

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem('ops-theme', theme)
  }, [theme])

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (!simulateLive) return
    const id = window.setInterval(() => {
      setSnapshot((prev) => nudgeSnapshot(prev))
    }, 3000)
    return () => window.clearInterval(id)
  }, [simulateLive])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    window.setTimeout(() => {
      setSnapshot(createInitialSnapshot(Date.now() % 10000))
      setRefreshing(false)
    }, 450)
  }, [])

  const onViewPayouts = useCallback(() => {
    const el = document.getElementById('payout-breakdown')
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setPayoutHighlight(true)
    window.setTimeout(() => setPayoutHighlight(false), 1600)
  }, [])

  return (
    <div className="min-h-screen">
      <Header
        now={now}
        theme={theme}
        timeFilter={timeFilter}
        simulateLive={simulateLive}
        refreshing={refreshing}
        onToggleTheme={() =>
          setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
        }
        onTimeFilter={setTimeFilter}
        onRefresh={onRefresh}
        onToggleSimulate={() => setSimulateLive((v) => !v)}
      />

      <main className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-ops-muted">
          <p>
            时间范围：
            <span className="ml-1 font-medium text-slate-700 dark:text-ops-text">
              {timeFilter === 'today'
                ? '今日'
                : timeFilter === 'yesterday'
                  ? '昨日'
                  : '近7日'}
            </span>
            <span className="mx-2 opacity-40">·</span>
            数据更新于{' '}
            <span className="font-mono tabular-nums">
              {new Date(snapshot.updatedAt).toLocaleTimeString('zh-CN', {
                hour12: false,
              })}
            </span>
          </p>
          <p className="hidden sm:block">
            Ops Dashboard Prototype · Interview Showcase
          </p>
        </div>

        <SystemTotals
          allUsers={snapshot.totals.allUsers}
          allTurnover={snapshot.totals.allTurnover}
        />

        <KpiGrid kpis={snapshot.kpis} onViewPayouts={onViewPayouts} />

        <ComparisonChart
          snapshot={snapshot}
          selected={selectedMetric}
          onSelect={setSelectedMetric}
          theme={theme}
        />

        <PayoutBreakdown
          payouts={snapshot.payouts}
          highlight={payoutHighlight}
          theme={theme}
        />

        <footer className="pb-6 text-center text-[11px] text-slate-400 dark:text-ops-muted/70">
          Mock data is internally consistent · 发放明细合计 = 平台发放总额 ·
          充值人数 ≤ 充值订单量
        </footer>
      </main>
    </div>
  )
}
