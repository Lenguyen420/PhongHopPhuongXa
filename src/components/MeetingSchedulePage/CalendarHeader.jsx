import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatMonthYear } from './calendarUtils'

function CalendarHeader({ currentDate, onNext, onPrev, onToday }) {
  return (
    <header className="flex items-center justify-between gap-4 py-1 shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl">
          Lịch họp
        </h1>
        <div className="hidden h-5 w-px bg-slate-200 min-[420px]:block" />
        <span className="text-sm font-bold text-slate-500 min-[420px]:text-base capitalize">
          {formatMonthYear(currentDate)}
        </span>
      </div>

      <div className="flex items-center gap-1.5 rounded-2xl bg-white p-1 shadow-sm ring-1 ring-slate-200/70">
        <button
          className="h-8 rounded-xl px-3 text-xs font-bold text-[#2563EB] transition hover:bg-blue-50"
          onClick={onToday}
          type="button"
        >
          Hôm nay
        </button>
        <button
          className="grid h-8 w-8 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100"
          onClick={onPrev}
          type="button"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          className="grid h-8 w-8 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100"
          onClick={onNext}
          type="button"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </header>
  )
}

export default CalendarHeader
