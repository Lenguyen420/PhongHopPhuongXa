import { CalendarDays, Clock3 } from 'lucide-react'

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  weekday: 'long',
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('vi-VN', {
  hour: '2-digit',
  minute: '2-digit',
})

function DashboardHeader() {
  const now = new Date()

  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2563EB] sm:text-sm sm:tracking-[0.18em]">
          Phòng họp trực tuyến Phường/Xã
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 min-[420px]:text-3xl sm:mt-3 sm:text-4xl">
          Tổng quan hệ thống
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-500 sm:text-base">
          Dữ liệu hoạt động phòng họp hôm nay
        </p>
      </div>

      <div className="grid gap-3 rounded-[20px] bg-white p-4 shadow-sm ring-1 ring-slate-200/70 sm:min-w-72 lg:justify-items-end">
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 min-[420px]:text-sm">
          <CalendarDays className="shrink-0 text-[#2563EB]" size={18} />
          <span>{dateFormatter.format(now)}</span>
        </div>
        <div className="flex items-center gap-3">
          <Clock3 className="shrink-0 text-[#10B981]" size={22} />
          <strong className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {timeFormatter.format(now)}
          </strong>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
