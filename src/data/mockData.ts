import type {
  DashboardSnapshot,
  HourlyPoint,
  KpiCode,
  KpiMetric,
  PayoutItem,
} from '../types'

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildHourly(
  rng: () => number,
  todayPeak: number,
  yesterdayPeak: number,
): HourlyPoint[] {
  const hours = Array.from({ length: 24 }, (_, i) =>
    `${String(i).padStart(2, '0')}:00`,
  )
  const currentHour = new Date().getHours()

  return hours.map((hour, i) => {
    const wave = 0.35 + 0.65 * Math.sin((i / 24) * Math.PI * 1.4 + 0.4)
    const noise = 0.85 + rng() * 0.3
    const todayFactor = i <= currentHour ? wave * noise : 0
    const yWave = 0.35 + 0.65 * Math.sin((i / 24) * Math.PI * 1.35 + 0.55)
    const yNoise = 0.85 + rng() * 0.3
    return {
      hour,
      today: Math.round(todayPeak * todayFactor * (0.04 + rng() * 0.02)),
      yesterday: Math.round(yesterdayPeak * yWave * yNoise * (0.04 + rng() * 0.02)),
    }
  })
}

function sumHourly(points: HourlyPoint[], key: 'today' | 'yesterday'): number {
  return points.reduce((acc, p) => acc + p[key], 0)
}

const PAYOUT_NAMES = [
  '今日排行榜发放',
  '今日VIP发放',
  '今日代理发放',
  '今日转盘实际发放',
  '今日波动反水发放',
  '今日充值赠送发放',
  '今日兑换码发放',
  '今日累充转盘发放',
  '今日回归福利发放',
  '今日惊喜礼包发放',
  '今日回归礼包发放',
] as const

function buildPayouts(rng: () => number, total: number): PayoutItem[] {
  const weights = [
    0.18, 0.14, 0.12, 0.1, 0.09, 0.08, 0.07, 0.07, 0.06, 0.05, 0.04,
  ]
  // Slight jitter then normalize
  const jittered = weights.map((w) => w * (0.92 + rng() * 0.16))
  const sumW = jittered.reduce((a, b) => a + b, 0)
  const amounts = jittered.map((w) => Math.round((w / sumW) * total * 100) / 100)

  // Fix rounding drift so sum === total
  const drift = Math.round((total - amounts.reduce((a, b) => a + b, 0)) * 100) / 100
  amounts[0] = Math.round((amounts[0] + drift) * 100) / 100

  return PAYOUT_NAMES.map((name, i) => {
    const amount = amounts[i]
    const count = Math.max(12, Math.round((amount / total) * (1800 + rng() * 900)))
    return {
      id: `payout-${i + 1}`,
      name,
      amount,
      count,
      percent: Math.round((amount / total) * 10000) / 100,
    }
  })
}

export function createInitialSnapshot(seed = 42): DashboardSnapshot {
  const rng = mulberry32(seed)

  // Core consistent values
  const rechargeOrders = 18420 + Math.floor(rng() * 800)
  const rechargeUsers = Math.floor(rechargeOrders * (0.62 + rng() * 0.08)) // ≤ orders
  const withdrawUsers = 6120 + Math.floor(rng() * 400)
  const newUsers = 9840 + Math.floor(rng() * 500)
  const firstDepositWithdraw = 1260 + Math.floor(rng() * 120)
  const onlineUsers = 42850 + Math.floor(rng() * 2000)
  const rechargeAmount = 12_845_620.5 + Math.round(rng() * 200_000)
  const withdrawAmount = 8_932_410.25 + Math.round(rng() * 150_000)
  const betTurnover = 156_420_880.0 + Math.round(rng() * 1_000_000)
  const platformPayout = 2_486_350.8

  const payouts = buildPayouts(rng, platformPayout)
  const payoutSum = payouts.reduce((a, p) => a + p.amount, 0)

  const ySame = (v: number, factor = 0.88 + rng() * 0.2) =>
    Math.round(v * factor * 100) / 100
  const yFull = (v: number) => Math.round(v * (1.08 + rng() * 0.18) * 100) / 100

  const kpis: KpiMetric[] = [
    {
      id: 'NU',
      name: '今日新增用户数',
      code: 'NU',
      value: newUsers,
      yesterdaySamePeriod: ySame(newUsers, 0.91),
      yesterdayFull: yFull(newUsers),
      format: 'int',
    },
    {
      id: 'CN',
      name: '今日充值金额',
      code: 'CN',
      value: rechargeAmount,
      yesterdaySamePeriod: ySame(rechargeAmount, 0.94),
      yesterdayFull: yFull(rechargeAmount),
      format: 'currency',
    },
    {
      id: 'WN',
      name: '今日提现金额',
      code: 'WN',
      value: withdrawAmount,
      yesterdaySamePeriod: ySame(withdrawAmount, 0.97),
      yesterdayFull: yFull(withdrawAmount),
      format: 'currency',
    },
    {
      id: 'FC',
      name: '今日首存提现人数',
      code: 'FC',
      value: firstDepositWithdraw,
      yesterdaySamePeriod: ySame(firstDepositWithdraw, 0.86),
      yesterdayFull: yFull(firstDepositWithdraw),
      format: 'int',
    },
    {
      id: 'OL',
      name: '今日在线用户数',
      code: 'OL',
      value: onlineUsers,
      yesterdaySamePeriod: ySame(onlineUsers, 0.93),
      yesterdayFull: yFull(onlineUsers),
      format: 'int',
      onlineLed: true,
    },
    {
      id: 'CU_ORDERS',
      name: '今日充值成功订单量',
      code: 'CU',
      codeLabel: '订单',
      value: rechargeOrders,
      yesterdaySamePeriod: ySame(rechargeOrders, 0.9),
      yesterdayFull: yFull(rechargeOrders),
      format: 'int',
    },
    {
      id: 'WU',
      name: '今日提现成功人数',
      code: 'WU',
      value: withdrawUsers,
      yesterdaySamePeriod: ySame(withdrawUsers, 0.95),
      yesterdayFull: yFull(withdrawUsers),
      format: 'int',
    },
    {
      id: 'GB',
      name: '今日下注流水',
      code: 'GB',
      value: betTurnover,
      yesterdaySamePeriod: ySame(betTurnover, 0.92),
      yesterdayFull: yFull(betTurnover),
      format: 'currency',
    },
    {
      id: 'CU_USERS',
      name: '今日充值成功人数',
      code: 'CU',
      codeLabel: '人数',
      value: rechargeUsers,
      yesterdaySamePeriod: ySame(rechargeUsers, 0.89),
      yesterdayFull: yFull(rechargeUsers),
      format: 'int',
    },
    {
      id: 'CU_PAYOUT',
      name: '今日平台发放总额',
      code: 'CU',
      codeLabel: '发放',
      value: payoutSum,
      yesterdaySamePeriod: ySame(payoutSum, 0.9),
      yesterdayFull: yFull(payoutSum),
      format: 'currency',
      scrollToPayouts: true,
    },
  ]

  const metricPeaks: Record<KpiCode, [number, number]> = {
    NU: [newUsers, yFull(newUsers)],
    CN: [rechargeAmount, yFull(rechargeAmount)],
    WN: [withdrawAmount, yFull(withdrawAmount)],
    FC: [firstDepositWithdraw, yFull(firstDepositWithdraw)],
    OL: [onlineUsers, yFull(onlineUsers)],
    CU_ORDERS: [rechargeOrders, yFull(rechargeOrders)],
    WU: [withdrawUsers, yFull(withdrawUsers)],
    GB: [betTurnover, yFull(betTurnover)],
    CU_USERS: [rechargeUsers, yFull(rechargeUsers)],
    CU_PAYOUT: [payoutSum, yFull(payoutSum)],
  }

  const hourlyByMetric = {} as Record<KpiCode, HourlyPoint[]>
  for (const [id, [todayPeak, yPeak]] of Object.entries(metricPeaks) as [
    KpiCode,
    [number, number],
  ][]) {
    const series = buildHourly(rng, todayPeak, yPeak)
    // Scale so today's sum roughly matches KPI value for period metrics
    if (id !== 'OL') {
      const todaySum = sumHourly(series, 'today') || 1
      const scale = todayPeak / todaySum
      series.forEach((p) => {
        p.today = Math.round(p.today * scale * 100) / 100
      })
    }
    hourlyByMetric[id] = series
  }

  return {
    totals: {
      allUsers: 1_284_590,
      allTurnover: 894_320_150.0,
    },
    kpis,
    payouts,
    hourlyByMetric,
    updatedAt: Date.now(),
  }
}

export function nudgeSnapshot(prev: DashboardSnapshot): DashboardSnapshot {
  const next = structuredClone(prev)
  const jitter = (base: number, pct: number) => {
    const delta = base * pct * (Math.random() * 2 - 0.3)
    return Math.max(0, Math.round((base + delta) * 100) / 100)
  }

  const bump = (id: KpiCode, pct: number, intMode = false) => {
    const kpi = next.kpis.find((k) => k.id === id)
    if (!kpi) return
    const v = jitter(kpi.value, pct)
    kpi.value = intMode ? Math.round(v) : v
  }

  bump('OL', 0.004, true)
  bump('GB', 0.0015)
  bump('CN', 0.002)

  // Related fields occasionally
  if (Math.random() > 0.4) bump('CU_ORDERS', 0.0015, true)
  if (Math.random() > 0.5) {
    const orders = next.kpis.find((k) => k.id === 'CU_ORDERS')
    const users = next.kpis.find((k) => k.id === 'CU_USERS')
    if (orders && users) {
      users.value = Math.min(
        orders.value,
        Math.round(users.value + (Math.random() > 0.5 ? 1 : 0)),
      )
    }
  }
  if (Math.random() > 0.6) bump('NU', 0.002, true)

  // Keep payout total in sync with CU_PAYOUT (no change on nudge for payout cards)

  // Light hourly today bump on last active hour
  const hour = new Date().getHours()
  for (const id of ['OL', 'GB', 'CN'] as KpiCode[]) {
    const series = next.hourlyByMetric[id]
    if (series?.[hour]) {
      series[hour].today =
        Math.round(series[hour].today * (1 + Math.random() * 0.01) * 100) / 100
    }
  }

  next.updatedAt = Date.now()
  return next
}

export const TIME_FILTER_LABELS = {
  today: '今日',
  yesterday: '昨日',
  '7d': '近7日',
} as const
