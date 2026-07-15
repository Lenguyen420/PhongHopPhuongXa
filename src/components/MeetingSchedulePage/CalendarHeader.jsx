import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatMonthYear } from './calendarUtils'

function CalendarHeader({ currentDate, onNext, onPrev, onToday }) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2563EB] sm:text-sm">
          Phòng họp trực tuyến Phường/Xã
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 min-[420px]:text-3xl sm:text-4xl">
          Lịch họp
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-500 sm:text-base">
          Quản lý và theo dõi toàn bộ lịch họp của đơn vị
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-[20px] bg-white p-2 shadow-sm ring-1 ring-slate-200/70">
        <button
          className="h-10 rounded-2xl px-4 text-sm font-bold text-[#2563EB] transition hover:bg-blue-50"
          onClick={onToday}
          type="button"
        >
          Hôm nay
        </button>
        <div className="min-w-36 px-2 text-center text-sm font-bold capitalize text-slate-800 sm:min-w-44">
          {formatMonthYear(currentDate)}
        </div>
        <button
          className="grid h-10 w-10 place-items-center rounded-2xl text-slate-600 transition hover:bg-slate-100"
          onClick={onPrev}
          type="button"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          className="grid h-10 w-10 place-items-center rounded-2xl text-slate-600 transition hover:bg-slate-100"
          onClick={onNext}
          type="button"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </header>
  )
}

export default CalendarHeader
