# 实时数据系统 · Ops Dashboard

Interview Showcase prototype — real-time operations console.

## Stack

- React + Vite + TypeScript
- Tailwind CSS v4
- Lucide Icons
- Recharts

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Scripts

- `npm run dev` — Vite dev server (`0.0.0.0:5173`)
- `npm run build` — production build
- `npm run preview` — preview built assets

## Features

- Dark / light theme toggle (default dark, slate + cyan/teal)
- Live clock + 「实时监控中」breathing LED
- System totals (ALL / AB)
- 10 real-time KPI cards with WoW deltas
- 今日 vs 昨日 24h comparison chart (all KPIs switchable)
- 11-channel payout breakdown with donut + rank bars
- 「模拟实时推送」nudges OL / GB / CN every 3s with number roll
