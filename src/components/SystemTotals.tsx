import { Users, Wallet } from 'lucide-react'
import { AnimatedNumber } from './AnimatedNumber'

interface SystemTotalsProps {
  allUsers: number
  allTurnover: number
}

export function SystemTotals({ allUsers, allTurnover }: SystemTotalsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <article className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-ops-border dark:bg-ops-surface sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-teal-500/5" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-cyan-700 dark:text-cyan-300">
                ALL
              </span>
              <h2 className="text-sm font-medium text-slate-500 dark:text-ops-muted">
                总注册用户数据
              </h2>
            </div>
            <p className="bg-gradient-to-r from-cyan-600 to-teal-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl lg:text-5xl">
              <AnimatedNumber value={allUsers} format="int" />
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-300">
            <Users className="h-5 w-5" />
          </div>
        </div>
      </article>

      <article className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-ops-border dark:bg-ops-surface sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-cyan-500/5" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-md border border-teal-500/30 bg-teal-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-teal-700 dark:text-teal-300">
                AB
              </span>
              <h2 className="text-sm font-medium text-slate-500 dark:text-ops-muted">
                总流水数据
              </h2>
            </div>
            <p className="bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl lg:text-[2.75rem]">
              <AnimatedNumber value={allTurnover} format="currency" />
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-300">
            <Wallet className="h-5 w-5" />
          </div>
        </div>
      </article>
    </section>
  )
}
