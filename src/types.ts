export type TimeFilter = 'today' | 'yesterday' | '7d'

export type KpiCode =
  | 'NU'
  | 'CN'
  | 'WN'
  | 'FC'
  | 'OL'
  | 'CU_ORDERS'
  | 'WU'
  | 'GB'
  | 'CU_USERS'
  | 'CU_PAYOUT'

export interface KpiMetric {
  id: KpiCode
  name: string
  code: string
  codeLabel?: string
  value: number
  yesterdaySamePeriod: number
  yesterdayFull: number
  format: 'int' | 'currency' | 'compact'
  onlineLed?: boolean
  scrollToPayouts?: boolean
}

export interface PayoutItem {
  id: string
  name: string
  amount: number
  count: number
  percent: number
}

export interface HourlyPoint {
  hour: string
  today: number
  yesterday: number
}

export interface DashboardSnapshot {
  totals: {
    allUsers: number
    allTurnover: number
  }
  kpis: KpiMetric[]
  payouts: PayoutItem[]
  hourlyByMetric: Record<KpiCode, HourlyPoint[]>
  updatedAt: number
}
